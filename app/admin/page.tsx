'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'special-access' | 'designations' | 'reports' | 'blocked'>('overview');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      window.location.href = '/';
      return;
    }

    // Check if user is admin
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (!dbUser || !dbUser.is_admin) {
      alert('Unauthorized access');
      window.location.href = '/feed';
      return;
    }

    setUser(dbUser);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">IET Akashvani Control Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <img
                src={user?.profile_pic_url}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('special-access')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'special-access'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Special Access
            </button>
            <button
              onClick={() => setActiveTab('designations')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'designations'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🎖️ Designations
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🚨 Reports
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'blocked'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🚫 Blocked Users
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'special-access' && <SpecialAccessTab adminId={user?.id} />}
        {activeTab === 'designations' && <DesignationsTab adminId={user?.id} />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'blocked' && <BlockedUsersTab />}
      </main>
    </div>
  );
}

// Overview Tab Component
function OverviewTab() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: specialUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_special_user', true);

    const { count: pendingDesignations } = await supabase
      .from('designations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: blockedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_banned', true);

    setStats({
      totalUsers,
      specialUsers,
      pendingDesignations,
      blockedUsers,
    });
  };

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-3xl mb-2">👥</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
        <div className="text-sm text-gray-600">Total Users</div>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-3xl mb-2">⭐</div>
        <div className="text-2xl font-bold text-gray-900">{stats.specialUsers}</div>
        <div className="text-sm text-gray-600">Special Access Users</div>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-3xl mb-2">⏳</div>
        <div className="text-2xl font-bold text-gray-900">{stats.pendingDesignations}</div>
        <div className="text-sm text-gray-600">Pending Designations</div>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-3xl mb-2">🚫</div>
        <div className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</div>
        <div className="text-sm text-gray-600">Blocked Users</div>
      </div>
    </div>
  );
}

// Special Access Tab Component
function SpecialAccessTab({ adminId }: { adminId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialUsers, setSpecialUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'Guest',
    accessLevel: 'read_only',
  });

  useEffect(() => {
    loadSpecialUsers();
  }, []);

  const loadSpecialUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('is_special_user', true)
      .order('created_at', { ascending: false });

    setSpecialUsers(data || []);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create user with special access
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: formData.email,
          name: formData.name,
          is_special_user: true,
          special_user_role: formData.role,
          access_level: formData.accessLevel,
          added_by: adminId,
          skip_setup: true,
        })
        .select()
        .single();

      if (error) throw error;

      alert('Special user added successfully!');
      setShowAddForm(false);
      setFormData({ email: '', name: '', role: 'Guest', accessLevel: 'read_only' });
      loadSpecialUsers();

      // TODO: Send email notification (Week 9-10 with Resend)
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleBlock = async (userId: string) => {
    if (!confirm('Block this user?')) return;

    const reason = prompt('Reason for blocking:');
    if (!reason) return;

    const { error } = await supabase
      .from('users')
      .update({
        is_banned: true,
        blocked_reason: reason,
        blocked_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (!error) {
      alert('User blocked');
      loadSpecialUsers();
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove this special access user? This will delete their account.')) return;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (!error) {
      alert('User removed');
      loadSpecialUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add User Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Special Access Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {showAddForm ? 'Cancel' : '+ Add Special User'}
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Special User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Guest">Guest</option>
                <option value="Faculty">Faculty</option>
                <option value="Special">Special</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Level *
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="read_only">Read Only</option>
                <option value="can_post">Can Post</option>
                <option value="full">Full Access</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Read Only: View only | Can Post: View + Post | Full: Everything
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Add User
            </button>
          </form>
        </div>
      )}

      {/* Special Users List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Special Access Users ({specialUsers.length})</h3>
        </div>
        
        {specialUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No special access users yet
          </div>
        ) : (
          <div className="divide-y">
            {specialUsers.map((user) => (
              <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {user.special_user_role}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {user.access_level.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBlock(user.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Designations Tab (placeholder)
function DesignationsTab({ adminId }: { adminId: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Designation Approvals</h2>
      <p className="text-gray-600">Coming in Week 9-10</p>
    </div>
  );
}

// Reports Tab (placeholder)
function ReportsTab() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Reports</h2>
      <p className="text-gray-600">Coming in Week 15-16</p>
    </div>
  );
}

// Blocked Users Tab
function BlockedUsersTab() {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('is_banned', true)
      .order('blocked_at', { ascending: false });

    setBlockedUsers(data || []);
  };

  const handleUnblock = async (userId: string) => {
    if (!confirm('Unblock this user?')) return;

    const { error } = await supabase
      .from('users')
      .update({
        is_banned: false,
        blocked_reason: null,
        blocked_at: null,
      })
      .eq('id', userId);

    if (!error) {
      alert('User unblocked');
      loadBlockedUsers();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Blocked Users ({blockedUsers.length})</h2>
      </div>
      
      {blockedUsers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No blocked users
        </div>
      ) : (
        <div className="divide-y">
          {blockedUsers.map((user) => (
            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    BLOCKED
                  </span>
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-medium">Reason:</span> {user.blocked_reason}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Blocked: {new Date(user.blocked_at).toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={() => handleUnblock(user.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
