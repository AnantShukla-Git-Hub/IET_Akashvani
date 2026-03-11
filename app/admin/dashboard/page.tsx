'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingReports: 0,
    pendingDesignations: 0,
    pendingAchievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      // Check if user is owner
      if (session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        console.log('Not owner, redirecting to home');
        window.location.href = '/';
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      setUser(profile || session.user);
      
      // Load stats
      await loadStats();
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loadStats = async () => {
    try {
      // Get total users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get pending reports count
      const { count: reportsCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get pending designations count
      const { count: designationsCount } = await supabase
        .from('designations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get pending achievements count
      const { count: achievementsCount } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: usersCount || 0,
        pendingReports: reportsCount || 0,
        pendingDesignations: designationsCount || 0,
        pendingAchievements: achievementsCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-purple-500/30 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-5xl">👑</div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Welcome, {user?.name || 'Owner'}!
              </h1>
              <p className="text-purple-300 text-sm mt-1">IET Akashvani Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-yellow-500/20 border border-yellow-500 rounded-full px-3 py-1 text-xs font-semibold text-yellow-200">
              GOD MODE ACTIVE
            </span>
            <span className="bg-purple-500/20 border border-purple-500 rounded-full px-3 py-1 text-xs text-purple-200">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">👥</span>
              <span className="text-3xl font-bold text-purple-400">{stats.totalUsers}</span>
            </div>
            <h3 className="text-gray-300 text-sm">Total Users</h3>
          </div>

          {/* Pending Reports */}
          <div className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🚩</span>
              <span className="text-3xl font-bold text-red-400">{stats.pendingReports}</span>
            </div>
            <h3 className="text-gray-300 text-sm">Pending Reports</h3>
          </div>

          {/* Pending Designations */}
          <div className="bg-gray-800/50 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">⭐</span>
              <span className="text-3xl font-bold text-yellow-400">{stats.pendingDesignations}</span>
            </div>
            <h3 className="text-gray-300 text-sm">Pending Designations</h3>
          </div>

          {/* Pending Achievements */}
          <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🏆</span>
              <span className="text-3xl font-bold text-green-400">{stats.pendingAchievements}</span>
            </div>
            <h3 className="text-gray-300 text-sm">Pending Achievements</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Manage Users */}
            <Link
              href="/admin/users"
              className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-purple-500/50 group"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                Manage Users
              </h3>
              <p className="text-sm text-gray-400">
                View, edit, ban, or add special users
              </p>
            </Link>

            {/* Manage Badges */}
            <Link
              href="/admin/badges"
              className="bg-gray-800/50 border border-yellow-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-yellow-500/50 group"
            >
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-yellow-400 transition-colors">
                Manage Badges
              </h3>
              <p className="text-sm text-gray-400">
                Approve designations and assign badges
              </p>
            </Link>

            {/* Review Reports */}
            <Link
              href="/admin/reports"
              className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-red-500/50 group"
            >
              <div className="text-4xl mb-3">🚩</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-red-400 transition-colors">
                Review Reports
              </h3>
              <p className="text-sm text-gray-400">
                Moderate reported content and users
              </p>
            </Link>

            {/* Achievements */}
            <Link
              href="/admin/achievements"
              className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-green-500/50 group"
            >
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-green-400 transition-colors">
                Achievements
              </h3>
              <p className="text-sm text-gray-400">
                Approve and celebrate student achievements
              </p>
            </Link>

            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-blue-500/50 group"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                Analytics
              </h3>
              <p className="text-sm text-gray-400">
                View platform statistics and insights
              </p>
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="bg-gray-800/50 border border-gray-500/30 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:border-gray-500/50 group"
            >
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                Settings
              </h3>
              <p className="text-sm text-gray-400">
                Configure platform settings and rules
              </p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Recent Activity</h2>
          <div className="text-center py-8 text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p>Activity feed coming soon...</p>
            <p className="text-sm mt-2">Track user actions, posts, and moderation events</p>
          </div>
        </div>

        {/* Back to Feed */}
        <div className="mt-8 text-center">
          <Link
            href="/feed"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
