'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email;
        
        // Allow owner email always (bypass domain check)
        if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          window.location.href = '/admin/dashboard';
          return;
        }
        
        // Check if email is allowed
        if (email?.endsWith(ALLOWED_EMAIL_DOMAIN)) {
          window.location.href = '/setup';
        } else {
          await supabase.auth.signOut();
          setError('Sirf IET Lucknow college email allowed hai 🙏');
        }
      }
    };
    checkUser();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account', // Force account selection
            access_type: 'offline',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-4xl">
            📻
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          IET Akashvani
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          IET ki Apni Awaaz 📻
        </p>

        {/* Description */}
        <div className="mb-8 text-left bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 mb-2">
            ✨ IET Lucknow ka apna social platform
          </p>
          <p className="text-sm text-gray-700 mb-2">
            💬 47 WhatsApp groups ki jagah ek platform
          </p>
          <p className="text-sm text-gray-700 mb-2">
            🎓 Placements, mess, achievements, vibes
          </p>
          <p className="text-sm text-gray-700">
            🔒 Sirf @ietlucknow.ac.in se login
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with College Email
            </>
          )}
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-500">
          Made with ❤️ by IET Student
        </p>
        <p className="mt-1 text-xs text-gray-400">
          ₹0/month forever • 100% free
        </p>
      </div>
    </div>
  );
}
