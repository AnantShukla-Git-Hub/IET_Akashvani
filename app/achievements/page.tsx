'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import { CldUploadWidget } from 'next-cloudinary';

interface Achievement {
  id: string;
  user_id: string;
  title: string;
  type: string;
  description: string;
  proof_image_url: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
  user: {
    name: string;
    profile_pic_url: string | null;
    badge_override: string | null;
  };
  likes_count?: number;
  is_liked?: boolean;
}

export default function AchievementsPage() {
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Academic');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const achievementTypes = ['Academic', 'Sports', 'Cultural', 'Tech'];

  useEffect(() => {
    checkAuth();
    loadAchievements(); // Load achievements immediately
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

  const loadAchievements = async () => {
    try {
      // Check if user is admin/owner to show all achievements
      const isAdmin = user && (user.is_admin || user.role === 'owner');
      
      let query = supabase
        .from('achievements')
        .select('*, user:users(name, profile_pic_url, branch, year)');

      // If not admin, only show approved achievements
      if (!isAdmin) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading achievements:', error);
        throw error;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    setSubmitting(true);

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
        .from('achievements')
        .insert({
          user_id: profile.id,
          title: title.trim(),
          type,
          description: description.trim(),
          proof_image_url: proofImage || null,
          // No status field - achievements are immediately visible
        });

      if (error) throw error;

      // Reset form
      setTitle('');
      setType('Academic');
      setDescription('');
      setProofImage('');
      setShowSubmitForm(false);
      
      // Reload achievements to show the new one immediately
      await loadAchievements();
      
      alert('Achievement posted successfully!');
    } catch (error: any) {
      console.error('Error submitting achievement:', error);
      alert(`Failed to submit achievement: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (achievementId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('achievement_likes')
        .select('id')
        .eq('achievement_id', achievementId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('achievement_likes')
          .delete()
          .eq('achievement_id', achievementId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('achievement_likes')
          .insert({
            achievement_id: achievementId,
            user_id: user.id,
          });
      }

      // Reload achievements
      await loadAchievements();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Academic': return 'bg-blue-500/20 border-blue-500 text-blue-200';
      case 'Sports': return 'bg-green-500/20 border-green-500 text-green-200';
      case 'Cultural': return 'bg-purple-500/20 border-purple-500 text-purple-200';
      case 'Tech': return 'bg-orange-500/20 border-orange-500 text-orange-200';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading achievements...</p>
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
            <h1 className="text-2xl font-bold text-orange-500">🏆 Achievements</h1>
            <p className="text-sm text-gray-400 mt-1">Celebrate student success</p>
          </div>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {showSubmitForm ? 'Cancel' : 'Share Achievement'}
          </button>
        </div>
      </div>

      {/* Submit Form */}
      {showSubmitForm && (
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-orange-500">Share Achievement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Achievement title"
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                >
                  {achievementTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your achievement"
                  className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-orange-500"
                  rows={4}
                  maxLength={500}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Proof Image (Optional)</label>
                <div className="flex gap-3">
                  <CldUploadWidget
                    uploadPreset="iet_akashvani"
                    onSuccess={(result: any) => {
                      setProofImage(result.info.secure_url);
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Upload Image
                      </button>
                    )}
                  </CldUploadWidget>
                  {proofImage && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-400">✓ Image uploaded</span>
                      <button
                        onClick={() => setProofImage('')}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                {proofImage && (
                  <img src={proofImage} alt="Proof" className="mt-2 rounded-lg max-h-32 object-cover" />
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !description.trim()}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Achievement'}
                </button>
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-400 text-lg mb-2">No achievements yet</p>
            <p className="text-sm text-gray-500">Be the first to share an achievement!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={achievement.user?.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(achievement.user?.name || 'User')}&background=f97316&color=fff`}
                    alt={achievement.user?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{achievement.user?.name || 'Unknown User'}</span>
                      {achievement.user?.badge_override && (
                        <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500 rounded text-xs text-orange-200">
                          ⭐ {achievement.user.badge_override}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{timeAgo(achievement.created_at)}</p>
                  </div>
                </div>

                {/* Achievement Content */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">{achievement.title}</h3>
                    <span className={`px-2 py-0.5 border rounded text-xs ${getTypeColor(achievement.type)}`}>
                      {achievement.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                  
                  {achievement.proof_image_url && (
                    <img
                      src={achievement.proof_image_url}
                      alt="Achievement proof"
                      className="w-full rounded-lg object-cover max-h-48 mb-3"
                    />
                  )}
                </div>

                {/* Like Button - Simplified for now */}
                <button
                  onClick={() => handleLike(achievement.id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span className="text-lg">🤍</span>
                  <span className="text-sm">0</span>
                </button>
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
          <Link href="/achievements" className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Achievements</span>
          </Link>
          <Link href="/announcements" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
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