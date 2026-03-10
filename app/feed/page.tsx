'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FeedPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      // Get user from database
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (!dbUser) {
        window.location.href = '/setup';
        return;
      }

      setUser(dbUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📻</span>
            <h1 className="text-xl font-bold text-gray-900">IET Akashvani</h1>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={user?.profile_pic_url}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}! 🎉
          </h2>
          <p className="text-gray-600 mb-2">
            Serial ID: {user?.serial_id}
          </p>
          <p className="text-gray-600 mb-2">
            Year: {user?.year} | Branch: {user?.branch}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Feed coming in Week 5-6 of development 🚀
          </p>
        </div>
      </main>

      {/* Bottom Navigation Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">💬</span>
            <span className="text-xs">Rooms</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">🏆</span>
            <span className="text-xs">Achievements</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">📢</span>
            <span className="text-xs">Announcements</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
