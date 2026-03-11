'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Designation {
  id: string;
  user_id: string;
  designation_title: string;
  unit: string | null;
  badge_level: string | null;
  status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    serial_id: string;
  };
}

export default function AdminBadgesPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadDesignations();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      window.location.href = '/';
    }
  };

  const loadDesignations = async () => {
    try {
      const { data, error } = await supabase
        .from('designations')
        .select(`
          *,
          user:users(name, email, serial_id)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesignations(data || []);
    } catch (error) {
      console.error('Error loading designations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (designationId: string, userId: string) => {
    const badgeLevel = prompt('Enter badge level (gold/silver/bronze):');
    if (!badgeLevel || !['gold', 'silver', 'bronze'].includes(badgeLevel.toLowerCase())) {
      alert('Invalid badge level. Please enter: gold, silver, or bronze');
      return;
    }

    if (!confirm(`Approve this designation with ${badgeLevel} badge?`)) return;

    try {
      // Update designation status
      const { error: designationError } = await supabase
        .from('designations')
        .update({
          status: 'approved',
          badge_level: badgeLevel.toLowerCase(),
          approved_at: new Date().toISOString(),
        })
        .eq('id', designationId);

      if (designationError) throw designationError;

      // Update user badge
      const { error: userError } = await supabase
        .from('users')
        .update({
          badge_override: badgeLevel.toLowerCase(),
        })
        .eq('id', userId);

      if (userError) throw userError;

      await loadDesignations();
      alert('Designation approved successfully!');
    } catch (error) {
      console.error('Error approving designation:', error);
      alert('Failed to approve designation');
    }
  };

  const handleReject = async (designationId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (!confirm('Are you sure you want to reject this designation?')) return;

    try {
      const { error } = await supabase
        .from('designations')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason || 'Rejected by admin',
        })
        .eq('id', designationId);

      if (error) throw error;

      await loadDesignations();
      alert('Designation rejected');
    } catch (error) {
      console.error('Error rejecting designation:', error);
      alert('Failed to reject designation');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p>Loading designations...</p>
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
              <h1 className="text-2xl font-bold text-yellow-300">⭐ Manage Badges</h1>
              <p className="text-sm text-gray-400 mt-1">Pending: {designations.length} designations</p>
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
        {designations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-300 mb-2">No pending designations</p>
            <p className="text-sm text-gray-400">All designation requests have been processed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {designations.map((designation) => (
              <div
                key={designation.id}
                className="bg-gray-800/50 border border-yellow-500/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">⭐</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {designation.designation_title}
                        </h3>
                        {designation.unit && (
                          <p className="text-sm text-gray-400">{designation.unit}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Requested by</p>
                        <p className="text-sm text-white">{designation.user.name}</p>
                        <p className="text-xs text-gray-400">{designation.user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Serial ID</p>
                        <p className="text-sm font-mono text-white">{designation.user.serial_id}</p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Requested: {new Date(designation.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(designation.id, designation.user_id)}
                      className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-200 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(designation.id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
