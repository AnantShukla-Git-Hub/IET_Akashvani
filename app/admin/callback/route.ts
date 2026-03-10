import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const email = data.session.user.email;

      // Check if user exists and is admin
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser && existingUser.is_admin) {
        // Admin user - redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', requestUrl.origin));
      } else {
        // Not admin - sign out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(
          new URL('/admin/login?error=unauthorized', requestUrl.origin)
        );
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/admin/login', requestUrl.origin));
}
