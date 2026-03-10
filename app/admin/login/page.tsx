'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-4xl">
            🔐
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Access
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          IET Akashvani Control Panel
        </p>

        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Authorized personnel only
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
          onClick={handleAdminLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold py-4 px-6 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Login as Admin'}
        </button>

        {/* Back Link */}
        <a
          href="/"
          className="block mt-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to main site
        </a>
      </div>
    </div>
  );
}
