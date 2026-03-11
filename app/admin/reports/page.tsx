'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Report {
  id: string;
  post_id: string;
  reported_by: string;
  reason: string;
  status: string;
  created_at: string;
  post: {
    content: string;
    user_id: string;
    is_anonymous: boolean;
  };
  reporter: {
    name: string;
    email: string;
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadReports();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      window.location.href = '/';
    }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          post:posts(content, user_id, is_anonymous),
          reporter:users!reported_by(name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (reportId: string) => {
    const reason = prompt('Enter dismissal reason (optional):');
    if (!confirm('Are you sure you want to dismiss this report?')) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'dismissed',
          dismissed_at: new Date().toISOString(),
          dismissal_reason: reason || 'Dismissed by admin',
        })
        .eq('id', reportId);

      if (error) throw error;

      await loadReports();
      alert('Report dismissed');
    } catch (error) {
      console.error('Error dismissing report:', error);
      alert('Failed to dismiss report');
    }
  };

  const handleTakeAction = async (reportId: string, postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      // Delete the post
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw deleteError;

      // Update report status
      const { error: reportError } = await supabase
        .from('reports')
        .update({ 
          status: 'action_taken',
          action_taken_at: new Date().toISOString(),
          action_description: 'Post deleted by admin',
        })
        .eq('id', reportId);

      if (reportError) throw reportError;

      await loadReports();
      alert('Post deleted and report marked as action taken');
    } catch (error) {
      console.error('Error taking action:', error);
      alert('Failed to take action');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p>Loading reports...</p>
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
              <h1 className="text-2xl font-bold text-red-300">🚩 Review Reports</h1>
              <p className="text-sm text-gray-400 mt-1">Pending: {reports.length} reports</p>
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
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-300 mb-2">No pending reports</p>
            <p className="text-sm text-gray-400">All reports have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-800/50 border border-red-500/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🚩</span>
                      <div>
                        <h3 className="text-lg font-semibold text-red-300">
                          Reported Post
                        </h3>
                        <p className="text-xs text-gray-400">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="font-semibold">Post Content:</span>
                      </p>
                      <p className="text-white">{report.post.content}</p>
                      {report.post.is_anonymous && (
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 border border-purple-500 rounded text-xs text-purple-200">
                          🎭 Anonymous Post
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Reported by</p>
                        <p className="text-sm text-white">{report.reporter.name}</p>
                        <p className="text-xs text-gray-400">{report.reporter.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Reason</p>
                        <p className="text-sm text-white">{report.reason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="px-4 py-2 bg-gray-500/20 border border-gray-500 text-gray-200 rounded-lg hover:bg-gray-500/30 transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleTakeAction(report.id, report.post_id)}
                      className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete Post
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
