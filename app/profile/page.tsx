'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatYearBranch, timeAgo } from '@/lib/utils';
import { CldUploadWidget } from 'next-cloudinary';

interface UserPost {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

interface UserAchievement {
  id: string;
  title: string;
  type: string;
  description: string;
  proof_image_url: string | null;
  approved_at: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [postsCount, setPostsCount] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      if (activeTab === 'posts') {
        loadUserPosts();
      } else if (activeTab === 'achievements') {
        loadUserAchievements();
      }
    }
  }, [activeTab, profile]);

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
        setNewName(userProfile.name || '');
        
        // Get posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userProfile.id)
          .eq('type', 'feed');
        
        setPostsCount(postsCount || 0);

        // Get achievements count
        const { count: achievementsCount } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userProfile.id)
          .eq('status', 'approved');
        
        setAchievementsCount(achievementsCount || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          created_at,
          likes:likes(count),
          comments:comments(count)
        `)
        .eq('user_id', profile.id)
        .eq('type', 'feed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const postsWithCounts = data?.map(post => ({
        ...post,
        likes_count: post.likes[0]?.count || 0,
        comments_count: post.comments[0]?.count || 0,
      })) || [];

      setUserPosts(postsWithCounts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const loadUserAchievements = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', profile.id)
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });

      if (error) throw error;

      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error loading user achievements:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || !profile) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: newName.trim() })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, name: newName.trim() });
      setEditingName(false);
      alert('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const handlePhotoUpload = async (result: any) => {
    if (!profile) return;

    setUploadingPhoto(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_pic_url: result.info.secure_url })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, profile_pic_url: result.info.secure_url });
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAchievementTypeColor = (type: string) => {
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
          <div className="relative">
            {profile?.profile_pic_url ? (
              <img
                src={profile.profile_pic_url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-5xl font-bold mb-4">
                {profile?.name ? getInitials(profile.name) : '?'}
              </div>
            )}
            
            {/* Photo Upload Button */}
            <CldUploadWidget
              uploadPreset="iet_akashvani"
              onSuccess={handlePhotoUpload}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-4 right-0 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600 disabled:opacity-50"
                  title="Change photo"
                >
                  {uploadingPhoto ? '⏳' : '📷'}
                </button>
              )}
            </CldUploadWidget>
          </div>
          
          {profile?.serial_id && (
            <div className="bg-orange-500/20 border border-orange-500 rounded-full px-4 py-1 text-sm font-mono">
              {profile.serial_id}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-center rounded-l-xl transition-colors ${
              activeTab === 'info' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'posts' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Posts ({postsCount})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-4 text-center rounded-r-xl transition-colors ${
              activeTab === 'achievements' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements ({achievementsCount})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3 text-orange-500">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Full Name</p>
                      {editingName ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                            placeholder="Enter your name"
                          />
                          <button
                            onClick={handleUpdateName}
                            className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingName(false);
                              setNewName(profile?.name || '');
                            }}
                            className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-white">{profile?.name || 'Not set'}</p>
                      )}
                    </div>
                    {!editingName && (
                      <button
                        onClick={() => setEditingName(true)}
                        className="ml-3 px-3 py-1 bg-orange-500/20 border border-orange-500 text-orange-200 rounded text-sm hover:bg-orange-500/30"
                      >
                        Edit
                      </button>
                    )}
                  </div>
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
            {(profile?.branch || profile?.year) && (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3 text-orange-500">Academic Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Year • Branch</p>
                    <p className="text-white">{formatYearBranch(profile.year, profile.branch)}</p>
                  </div>
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

            {/* Stats */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3 text-orange-500">Activity</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{postsCount}</p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">{achievementsCount}</p>
                  <p className="text-xs text-gray-400">Achievements</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-400">-</p>
                  <p className="text-xs text-gray-400">Likes</p>
                </div>
              </div>
            </div>

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
                {profile?.is_banned && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg px-3 py-2">
                    <p className="text-sm text-red-200">🚫 Account Suspended</p>
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
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-400">No posts yet</p>
                <p className="text-sm text-gray-500 mt-2">Share your thoughts on the feed!</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                  <div className="mb-3">
                    <p className="text-white whitespace-pre-wrap">{post.content}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="mt-3 rounded-lg max-h-64 w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>❤️ {post.likes_count}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {userAchievements.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-gray-400">No achievements yet</p>
                <p className="text-sm text-gray-500 mt-2">Submit your achievements for approval!</p>
              </div>
            ) : (
              userAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">{achievement.title}</h3>
                    <span className={`px-2 py-0.5 border rounded text-xs ${getAchievementTypeColor(achievement.type)}`}>
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
                  
                  <p className="text-xs text-gray-500">Approved {timeAgo(achievement.approved_at)}</p>
                </div>
              ))
            )}
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