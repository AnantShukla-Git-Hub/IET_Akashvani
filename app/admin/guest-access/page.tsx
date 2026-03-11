'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { isOwnerUser } from '@/lib/accessControl';

export default function AdminGuestAccessPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [guestEnabled, setGuestEnabled] = useState(false);
  const [guestCode, setGuestCode] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkAuth();
    loadGuestSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      window.location.href = '/';
      return;
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (!dbUser || !isOwnerUser(dbUser)) {
      window.location.href = '/';
      return;
    }

    setUser(dbUser);
    setLoading(false);
  };

  const loadGuestSettings = async () => {
    try {
      // Check if guest settings exist in environment or database
      // For now, we'll use localStorage for simplicity (₹0 cost)
      const enabled = localStorage.getItem('guest_access_enabled') === 'true';
      const code = localStorage.getItem('guest_access_code') || '';
      
      setGuestEnabled(enabled);
      setGuestCode(code);
    } catch (error) {
      console.error('Error loading guest settings:', error);
    }
  };

  const generateNewCode = () => {
    // Generate a simple 8-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGuestCode(result);
  };

  const saveSettings = async () => {
    setUpdating(true);
    
    try {
      // Save to localStorage (₹0 cost solution)
      localStorage.setItem('guest_access_enabled', guestEnabled.toString());
      localStorage.setItem('guest_access_code', guestCode);
      
      alert('Guest access settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setUpdating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(guestCode);
    alert('Guest code copied to clipboard!');
  };

  const copyGuestLink = () => {
    const link = `${window.location.origin}/guest-login?code=${guestCode}`;
    navigator.clipboard.writeText(link);
    alert('Guest login link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p>Loading guest access settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-purple-500/30 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-yellow-300">🔑 Guest Access Management</h1>
              <p className="text-sm text-gray-400 mt-1">Manage recruiter and guest access</p>
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Guest Access Toggle */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Guest Access Control</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guestEnabled}
                  onChange={(e) => setGuestEnabled(e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-white">Enable Guest Access</span>
              </label>
            </div>
            
            <p className="text-sm text-gray-400">
              When enabled, recruiters and guests can access the platform with read-only permissions using the access code.
            </p>
          </div>

          {/* Access Code Management */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Access Code</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Access Code</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={guestCode}
                    onChange={(e) => setGuestCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 font-mono text-lg"
                    placeholder="Enter access code"
                    maxLength={8}
                  />
                  <button
                    onClick={generateNewCode}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate New
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyCode}
                  disabled={!guestCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  📋 Copy Code
                </button>
                <button
                  onClick={copyGuestLink}
                  disabled={!guestCode}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  🔗 Copy Guest Link
                </button>
              </div>
            </div>
          </div>

          {/* Guest Permissions */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Guest Permissions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-green-400 mb-2">✅ Allowed Actions</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• View feed posts</li>
                  <li>• View discussion rooms</li>
                  <li>• View achievements</li>
                  <li>• View announcements</li>
                  <li>• Browse user profiles</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-red-400 mb-2">❌ Restricted Actions</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Create posts</li>
                  <li>• Send messages</li>
                  <li>• Like/comment</li>
                  <li>• Submit achievements</li>
                  <li>• Access admin features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Usage Instructions</h2>
            
            <div className="space-y-3 text-sm text-gray-300">
              <p><strong>For Recruiters:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Share the guest login link with recruiters</li>
                <li>They visit the link and enter the access code</li>
                <li>They get read-only access to browse student content</li>
                <li>No account creation required</li>
              </ol>
              
              <p className="mt-4"><strong>Security Notes:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Change the access code regularly</li>
                <li>Disable guest access when not needed</li>
                <li>Monitor guest activity if needed</li>
                <li>Guests cannot modify any content</li>
              </ul>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={saveSettings}
              disabled={updating || !guestCode.trim()}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {updating ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}