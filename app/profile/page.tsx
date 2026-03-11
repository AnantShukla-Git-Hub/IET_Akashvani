'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          window.location.href = '/';
          return;
        }

        setUser(authUser);

        // Get user profile from database
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <h1 className="text-2xl font-bold text-orange-500">👤 Profile</h1>
        <p className="text-sm text-gray-400 mt-1">Your account information</p>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          {profile?.profile_pic_url ? (
            <img
              src={profile.profile_pic_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-5xl mb-4">
              {profile?.name?.charAt(0) || '?'}
            </div>
          )}
          
          {profile?.serial_id && (
            <div className="bg-orange-500/20 border border-orange-500 rounded-full px-4 py-1 text-sm font-mono">
              {profile.serial_id}
            </div>
          )}
        </div>

        {/* Profile Info Cards */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3 text-orange-500">Basic Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-white">{profile?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-white">{user?.email || 'Not set'}</p>
              </div>
              {profile?.roll_number && (
                <div>
                  <p className="text-xs text-gray-400">Roll Number</p>
                  <p className="text-white font-mono">{profile.roll_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Info */}
          {profile?.branch && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3 text-orange-500">Academic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Branch</p>
                  <p className="text-white">{profile.branch}</p>
                </div>
                {profile.year && (
                  <div>
                    <p className="text-xs text-gray-400">Current Year</p>
                    <p className="text-white">{profile.year}{['st', 'nd', 'rd', 'th'][profile.year - 1]} Year</p>
                  </div>
                )}
                {profile.batch_year && (
                  <div>
                    <p className="text-xs text-gray-400">Batch</p>
                    <p className="text-white">{profile.batch_year}</p>
                  </div>
                )}
                {profile.is_alumni && (
                  <div className="bg-purple-500/20 border border-purple-500 rounded-lg px-3 py-2">
                    <p className="text-sm text-purple-200">🎓 Alumni</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3 text-orange-500">Account Status</h2>
            <div className="space-y-2">
              {profile?.role === 'owner' && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg px-3 py-2">
                  <p className="text-sm text-yellow-200">👑 Owner / GOD MODE</p>
                </div>
              )}
              {profile?.is_admin && (
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg px-3 py-2">
                  <p className="text-sm text-blue-200">🛡️ Admin</p>
                </div>
              )}
              {profile?.badge_override && (
                <div className="bg-orange-500/20 border border-orange-500 rounded-lg px-3 py-2">
                  <p className="text-sm text-orange-200">⭐ Badge: {profile.badge_override}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500/20 border border-red-500 text-red-200 py-3 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 py-3">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          <Link href="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Feed</span>
          </Link>
          <Link href="/rooms" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Rooms</span>
          </Link>
          <Link href="/achievements" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Achievements</span>
          </Link>
          <Link href="/announcements" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">📢</span>
            <span className="text-xs">Announcements</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
