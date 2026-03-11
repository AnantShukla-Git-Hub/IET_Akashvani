'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function GuestLoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill code from URL if provided
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setAccessCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleLogin = async () => {
    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if guest access is enabled
      const guestEnabled = localStorage.getItem('guest_access_enabled') === 'true';
      const validCode = localStorage.getItem('guest_access_code');

      if (!guestEnabled) {
        throw new Error('Guest access is currently disabled');
      }

      if (accessCode.toUpperCase() !== validCode) {
        throw new Error('Invalid access code');
      }

      // Set guest session
      localStorage.setItem('guest_session', 'true');
      localStorage.setItem('guest_login_time', new Date().toISOString());
      
      // Redirect to feed
      window.location.href = '/feed';
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-orange-500 mb-2">Guest Access</h1>
          <p className="text-gray-400">Enter your access code to browse IET Akashvani</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Access Code
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 font-mono text-lg text-center tracking-widest"
                placeholder="XXXXXXXX"
                maxLength={8}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !accessCode.trim()}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Verifying...' : 'Access Platform'}
            </button>
          </div>
        </div>

        {/* Guest Info */}
        <div className="mt-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <h3 className="font-medium text-orange-500 mb-2">Guest Access Information</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• <strong>Read-only access</strong> to all content</p>
            <p>• View posts, achievements, and announcements</p>
            <p>• Browse discussion rooms and profiles</p>
            <p>• Cannot post, comment, or interact</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}