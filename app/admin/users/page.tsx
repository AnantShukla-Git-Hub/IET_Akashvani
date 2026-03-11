'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { formatYearBranch } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name: string;
  roll_number: string | null;
  year: number | null;
  branch: string | null;
  role: string;
  is_admin: boolean;
  is_banned: boolean;
  is_special_user: boolean;
  special_user_role: string | null;
  badge_override: string | null;
  serial_id: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
    loadUsers();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      window.location.href = '/';
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_banned: !currentBanStatus,
          blocked_at: !currentBanStatus ? new Date().toISOString() : null,
          blocked_reason: !currentBanStatus ? 'Banned by admin' : null,
        })
        .eq('id', userId);

      if (error) throw error;
      
      await loadUsers();
      alert(`User ${!currentBanStatus ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error('Error toggling ban:', error);
      alert('Failed to update user status');
    }
  };

  const handleMakeSpecial = async (userId: string) => {
    const role = prompt('Enter role (Guest/Faculty/Special/Alumni):');
    if (!role) return;

    const accessLevel = prompt('Enter access level (read_only/can_post/full):');
    if (!accessLevel) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_special_user: true,
          special_user_role: role,
          access_level: accessLevel,
        })
        .eq('id', userId);

      if (error) throw error;
      
      await loadUsers();
      alert('User updated to special user successfully');
    } catch (error) {
      console.error('Error making special user:', error);
      alert('Failed to update user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.serial_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-purple-500/30 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-300">👥 Manage Users</h1>
              <p className="text-sm text-gray-400 mt-1">Total: {users.length} users</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or serial ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Serial ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Year • Branch</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Role/Badge</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm font-mono">{user.serial_id}</td>
                    <td className="px-4 py-3 text-sm">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{formatYearBranch(user.year, user.branch)}</td>
                    <td className="px-4 py-3 text-sm">
                      {user.role === 'owner' && (
                        <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-xs text-yellow-200">
                          👑 Owner
                        </span>
                      )}
                      {user.is_admin && user.role !== 'owner' && (
                        <span className="px-2 py-1 bg-blue-500/20 border border-blue-500 rounded text-xs text-blue-200">
                          🛡️ Admin
                        </span>
                      )}
                      {user.badge_override && (
                        <span className="px-2 py-1 bg-orange-500/20 border border-orange-500 rounded text-xs text-orange-200">
                          ⭐ {user.badge_override}
                        </span>
                      )}
                      {user.is_special_user && (
                        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-xs text-purple-200">
                          {user.special_user_role}
                        </span>
                      )}
                      {!user.role && !user.is_admin && !user.badge_override && !user.is_special_user && (
                        <span className="text-gray-400 text-xs">Student</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.is_banned ? (
                        <span className="px-2 py-1 bg-red-500/20 border border-red-500 rounded text-xs text-red-200">
                          🚫 Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 border border-green-500 rounded text-xs text-green-200">
                          ✅ Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {user.role !== 'owner' && (
                          <>
                            <button
                              onClick={() => handleBanToggle(user.id, user.is_banned)}
                              className={`px-3 py-1 rounded text-xs ${
                                user.is_banned
                                  ? 'bg-green-500/20 border border-green-500 text-green-200 hover:bg-green-500/30'
                                  : 'bg-red-500/20 border border-red-500 text-red-200 hover:bg-red-500/30'
                              }`}
                            >
                              {user.is_banned ? 'Unban' : 'Ban'}
                            </button>
                            {!user.is_special_user && (
                              <button
                                onClick={() => handleMakeSpecial(user.id)}
                                className="px-3 py-1 bg-purple-500/20 border border-purple-500 text-purple-200 rounded text-xs hover:bg-purple-500/30"
                              >
                                Make Special
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
