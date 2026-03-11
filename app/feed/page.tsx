'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { canPerformAction, getPostAuthorName, getPostAuthorAvatar, getPostAuthorBranch, getUserBadge, getBadgeColor, isOwnerUser } from '@/lib/accessControl';
import { timeAgo, formatCount, compressImage } from '@/lib/utils';
import { CldUploadWidget } from 'next-cloudinary';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  is_anonymous: boolean;
  created_at: string;
  user?: any;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export default function FeedPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuth();
    loadPosts();
    subscribeToRealtime();
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

    setUser(dbUser);
    setLoading(false);
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*),
        likes:likes(count),
        comments:comments(count)
      `)
      .eq('type', 'feed')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      const postsWithCounts = data.map(post => ({
        ...post,
        likes_count: post.likes[0]?.count || 0,
        comments_count: post.comments[0]?.count || 0,
      }));
      setPosts(postsWithCounts);
    }
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: 'type=eq.feed',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            loadPosts(); // Reload to get user data
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && !postImage) {
      alert('Please enter some content or add an image');
      return;
    }

    if (newPost.length > 500) {
      alert('Post is too long (max 500 characters)');
      return;
    }

    if (!canPerformAction(user, 'canPost')) {
      alert('You do not have permission to post');
      return;
    }

    setPosting(true);

    try {
      // Get current auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('Not authenticated');
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single();

      if (profileError || !profile) {
        console.error('Profile error:', profileError);
        throw new Error('User profile not found');
      }

      console.log('Creating post with user_id:', profile.id);

      // Create post with correct user_id
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: profile.id,
          content: newPost.trim(),
          image_url: postImage || null,
          is_anonymous: isAnonymous,
          type: 'feed',
        });

      if (error) {
        console.error('Post insert error:', error);
        throw error;
      }

      // Reset form
      setNewPost('');
      setPostImage('');
      setIsAnonymous(false);
      
      // Reload posts
      await loadPosts();
    } catch (error: any) {
      console.error('Error creating post:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(`Failed to create post: ${error.message || 'Unknown error'}`);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!canPerformAction(user, 'canLike')) return;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });
    }

    // Reload posts to update counts
    await loadPosts();
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📻</span>
            <h1 className="text-xl font-bold text-white">IET Akashvani</h1>
          </div>
          <div className="flex items-center gap-3">
            {getUserBadge(user) && (
              <span className={`px-2 py-1 text-xs rounded ${getBadgeColor(getUserBadge(user))}`}>
                {getUserBadge(user)}
              </span>
            )}
            <img
              src={user?.profile_pic_url}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#2a2a2a]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Creation Box */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <img
              src={isAnonymous ? '/anonymous-avatar.png' : user?.profile_pic_url}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={isAnonymous ? "Post as Anonymous IETian..." : "What's on your mind?"}
                className="w-full bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-orange-500"
                rows={3}
                maxLength={500}
              />
              
              {postImage && (
                <div className="mt-2 relative">
                  <img src={postImage} alt="Upload" className="rounded-lg max-h-48 object-cover" />
                  <button
                    onClick={() => setPostImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <CldUploadWidget
                    uploadPreset="iet_akashvani"
                    onSuccess={(result: any) => {
                      setPostImage(result.info.secure_url);
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="text-gray-400 hover:text-orange-500"
                        title="Add image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                  </CldUploadWidget>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-400">Post as Anonymous IETian</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{newPost.length}/500</span>
                  <button
                    onClick={handleCreatePost}
                    disabled={posting || (!newPost.trim() && !postImage)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center">
              <p className="text-gray-400">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onLike={handleLike}
                onToggleComments={toggleComments}
                isCommentsExpanded={expandedComments.has(post.id)}
              />
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium">Feed</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
            <span className="text-2xl">💬</span>
            <span className="text-xs">Rooms</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
            <span className="text-2xl">🏆</span>
            <span className="text-xs">Achievements</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
            <span className="text-2xl">📢</span>
            <span className="text-xs">Announcements</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-300">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// Post Card Component
function PostCard({ post, currentUser, onLike, onToggleComments, isCommentsExpanded }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  const authorName = getPostAuthorName(post, currentUser);
  const authorAvatar = getPostAuthorAvatar(post, currentUser);
  const authorBranch = getPostAuthorBranch(post, currentUser);
  const badge = getUserBadge(post.user);

  useEffect(() => {
    if (isCommentsExpanded) {
      loadComments();
    }
  }, [isCommentsExpanded]);

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (newComment.length > 200) {
      alert('Comment is too long (max 200 characters)');
      return;
    }

    setCommenting(true);

    try {
      await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: currentUser.id,
          content: newComment.trim(),
        });

      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  // Determine border style based on badge
  let borderClass = 'border-[#2a2a2a]';
  if (badge === 'OWNER' || badge === 'gold') {
    borderClass = 'border-l-4 border-l-yellow-500';
  } else if (badge === 'silver') {
    borderClass = 'border-l-4 border-l-gray-400';
  }

  return (
    <div className={`bg-[#1a1a1a] border ${borderClass} rounded-xl p-4`}>
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{authorName}</span>
            {badge && (
              <span className={`px-2 py-0.5 text-xs rounded ${getBadgeColor(badge)}`}>
                {badge === 'OWNER' || badge === 'gold' ? '⭐ Official' : badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{authorBranch}</p>
          <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-white whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="mt-3 rounded-lg max-h-96 w-full object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-[#2a2a2a]">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500"
        >
          <span className="text-xl">{post.is_liked ? '❤️' : '🤍'}</span>
          <span className="text-sm">{formatCount(post.likes_count || 0)}</span>
        </button>

        <button
          onClick={() => onToggleComments(post.id)}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-500"
        >
          <span className="text-xl">💬</span>
          <span className="text-sm">{formatCount(post.comments_count || 0)}</span>
        </button>

        {badge !== 'OWNER' && badge !== 'gold' && badge !== 'silver' && (
          <button className="flex items-center gap-2 text-gray-400 hover:text-orange-500">
            <span className="text-xl">🚩</span>
            <span className="text-sm">Report</span>
          </button>
        )}
      </div>

      {/* Comments Section */}
      {isCommentsExpanded && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          {/* Comment Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              maxLength={200}
            />
            <button
              onClick={handleComment}
              disabled={commenting || !newComment.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <img
                  src={comment.user?.profile_pic_url}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 bg-[#0a0a0a] rounded-lg p-2">
                  <p className="text-sm font-medium text-white">{comment.user?.name}</p>
                  <p className="text-sm text-gray-300">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{timeAgo(comment.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
