import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';

/**
 * OAuth Callback Handler
 * 
 * This route handles the OAuth callback from Google after user authentication.
 * 
 * Flow:
 * 1. User clicks login → redirected to Google OAuth
 * 2. User selects account (forced by prompt: 'select_account')
 * 3. Google redirects back to: http://localhost:3000/auth/callback?code=...
 * 4. This handler exchanges code for session
 * 5. Validates email domain (@ietlucknow.ac.in)
 * 6. Redirects to /setup (new user) or /feed (existing user)
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const email = data.session.user.email;
      const ownerEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      // Special handling for owner/admin
      if (email === ownerEmail) {
        console.log('Owner login detected, checking/creating owner profile');
        
        // Check if owner profile exists
        const { data: ownerUser, error: ownerError } = await supabase
          .from('users')
          .select('id, role, is_admin')
          .eq('email', email)
          .single();

        if (!ownerUser) {
          // Create owner profile (no roll number needed)
          console.log('Creating owner profile');
          const { error: createError } = await supabase
            .from('users')
            .insert({
              email: email,
              name: data.session.user.user_metadata.full_name || 'Owner',
              role: 'owner',
              is_admin: true,
              skip_setup: true,
              can_see_anonymous: true,
              badge_override: 'owner',
            });

          if (createError) {
            console.error('Error creating owner profile:', createError);
          }
        }

        // Redirect owner to admin dashboard
        console.log('Redirecting owner to admin dashboard');
        return NextResponse.redirect(new URL('/admin', requestUrl.origin));
      }

      // Check if email is from IET Lucknow
      if (email && email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
        // Check if user already exists in database
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('id, skip_setup')
          .eq('email', email)
          .single();

        if (userError) {
          // Log error but don't fail - might be "no rows" error for new user
          console.log('User lookup:', userError.code === 'PGRST116' ? 'New user' : userError.message);
        }

        if (existingUser) {
          // Returning user → go to feed directly
          console.log('Existing user found, redirecting to feed');
          return NextResponse.redirect(new URL('/feed', requestUrl.origin));
        } else {
          // New user → go to setup
          console.log('New user, redirecting to setup');
          return NextResponse.redirect(new URL('/setup', requestUrl.origin));
        }
      } else {
        // Not IET email - sign out and redirect with error
        console.log('Invalid email domain:', email);
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/?error=invalid_email', requestUrl.origin)
        );
      }
    } else {
      // OAuth error
      console.error('OAuth error:', error);
    }
  }

  // Fallback redirect
  console.log('No code or error, redirecting to home');
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
