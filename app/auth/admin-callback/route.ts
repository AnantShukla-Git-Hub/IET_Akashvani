import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const email = data.session.user.email;
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      // Check if this is the owner email
      if (email === adminEmail) {
        // Check if owner user exists in database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (!existingUser) {
          // Create owner user
          await supabase.from('users').insert({
            email: email,
            name: 'Anant Shukla',
            role: 'owner',
            is_admin: true,
            skip_setup: true,
            profile_pic_url: data.session.user.user_metadata.avatar_url || '',
          });
        }

        // Redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin/dashboard', requestUrl.origin));
      } else {
        // Not the owner - sign out and deny access
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/auth/admin-phoenix-gate?error=access_denied', requestUrl.origin)
        );
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
