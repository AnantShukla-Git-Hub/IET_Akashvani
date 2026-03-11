'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import { isOwnerUser } from '@/lib/accessControl';

interface Announcement {
  id: string;
  user_id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
  user: {
    name: string;
    profile_pic_url: string | null;
    badge_override: string | null;
  };
  likes_count?: number;
  is_liked?: boolean;
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    checkAuth();
    loadAnnouncements();
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

    if (!dbUser) {
      window.location.href = '/setup';
      return;
    }

    if (dbUser.is_banned) {
      window.location.href = '/feed';
      return;
    }

    setUser(dbUser);
    setLoading(false);
  };

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          user:users(name, profile_pic_url, badge_override),
          likes:announcement_likes(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const announcementsWithCounts = data?.map(announcement => ({
        ...announcement,
        likes_count: announcement.likes[0]?.count || 0,
      })) || [];

      setAnnouncements(announcementsWithCounts);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setPosting(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('Not authenticated');
      }

      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      const { error } = await supabase
        .from('announcements')
        .insert({
          user_id: profile.id,
          title: title.trim(),
          content: content.trim(),
          priority,
        });

      if (error) throw error;

      // Reset form
      setTitle('');
      setContent('');
      setPriority('normal');
      setShowCreateForm(false);
      
      // Reload announcements
      await loadAnnouncements();
      
      alert('Announcement posted successfully!');
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      alert(`Failed to create announcement: ${error.message}`);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (announcementId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('announcement_likes')
        .select('id')
        .eq('announcement_id', announcementId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('announcement_likes')
          .delete()
          .eq('announcement_id', announcementId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('announcement_likes')
          .insert({
            announcement_id: announcementId,
            user_id: user.id,
          });
      }

      // Reload announcements
      await loadAnnouncements();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 border-red-500 text-red-200';
      case 'important': return 'bg-yellow-500/20 border-yellow-500 text-yellow-200';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'important': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const canCreateAnnouncement = user && (user.is_admin || isOwnerUser(user) || user.badge_override);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">📢 Announcements</h1>
            <p className="text-sm text-gray-400 mt-1">Official college updates</p>
          </div>
          {canCreateAnnouncement && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'New Announcement'}
            </button>
          )}
        </div>
      </div>

      {/* Create Form (Admin Only) */}
      {showCreateForm && canCreateAnnouncement && (
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-orange-500">Create Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Announcement content"
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-orange-500"
                  rows={6}
                  maxLength={1000}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={posting || !title.trim() || !content.trim()}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {posting ? 'Posting...' : 'Post Announcement'}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-gray-400 text-lg mb-2">No announcements yet</p>
            <p className="text-sm text-gray-500">
              {canCreateAnnouncement 
                ? 'Be the first to post an announcement!' 
                : 'Check back later for official updates'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={announcement.user.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(announcement.user.name)}&background=f97316&color=fff`}
                      alt={announcement.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{announcement.user.name}</span>
                        {announcement.user.badge_override && (
                          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500 rounded text-xs text-orange-200">
                            ⭐ {announcement.user.badge_override}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{timeAgo(announcement.created_at)}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 border rounded-full text-xs flex items-center gap-1 ${getPriorityColor(announcement.priority)}`}>
                    <span>{getPriorityIcon(announcement.priority)}</span>
                    {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{announcement.title}</h3>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{announcement.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#2a2a2a]">
                  <button
                    onClick={() => handleLike(announcement.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="text-lg">{announcement.is_liked ? '❤️' : '🤍'}</span>
                    <span className="text-sm">{announcement.likes_count || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <Link href="/announcements" className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-2xl">📢</span>
            <span className="text-xs">Announcements</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
