import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const email = data.session.user.email;

      // Check if email is from IET Lucknow
      if (email && email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
        // Check if user exists in database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (existingUser) {
          // Existing user - redirect to feed
          return NextResponse.redirect(new URL('/feed', requestUrl.origin));
        } else {
          // New user - redirect to setup
          return NextResponse.redirect(new URL('/setup', requestUrl.origin));
        }
      } else {
        // Not IET email - sign out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/?error=invalid_email', requestUrl.origin)
        );
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
