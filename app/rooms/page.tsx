'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { timeAgo, getOrdinal } from '@/lib/utils';
import { isOwnerUser } from '@/lib/accessControl';

interface Room {
  id: string;
  name: string;
  type: string;
  branch: string | null;
  year: number | null;
  is_cross_branch: boolean;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user: {
    name: string;
    profile_pic_url: string | null;
  };
}

interface UserRooms {
  myClass: Room | null;
  myBranch: Room | null;
  general: Room[];
  allRooms?: Room[]; // Only for owner
}

export default function RoomsPage() {
  const [user, setUser] = useState<any>(null);
  const [userRooms, setUserRooms] = useState<UserRooms>({
    myClass: null,
    myBranch: null,
    general: [],
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadAllMessages();
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`room-${selectedRoom.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${selectedRoom.id}`,
          },
          (payload) => {
            console.log('New message received:', payload.new);
            
            // Get user info for the new message
            supabase
              .from('users')
              .select('name, profile_pic_url')
              .eq('id', payload.new.user_id)
              .single()
              .then(({ data: userData }) => {
                if (userData) {
                  const newMessage = {
                    ...payload.new,
                    user: userData,
                  } as Message;
                  
                  // Add new message to state instantly
                  setMessages(prev => [...prev, newMessage]);
                  
                  // Auto scroll to bottom
                  setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              });
          }
        )
        .subscribe();

      // Cleanup on room change
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedRoom]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    await loadUserRooms(dbUser);
    setLoading(false);
  };

  // RULE 1: Auto Room Detection
  const loadUserRooms = async (currentUser: any) => {
    try {
      const isOwner = isOwnerUser(currentUser);
      
      if (isOwner) {
        // RULE 5: Owner GOD MODE - sees ALL rooms
        const { data: allRooms, error } = await supabase
          .from('rooms')
          .select('*')
          .order('type', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;

        // Separate rooms for owner
        const myClass = allRooms?.find(r => 
          r.type === 'class' && 
          r.year === currentUser.year && 
          r.branch === currentUser.branch
        ) || null;

        const myBranch = allRooms?.find(r => 
          r.type === 'branch' && 
          r.branch === currentUser.branch
        ) || null;

        const general = allRooms?.filter(r => r.is_cross_branch) || [];

        setUserRooms({
          myClass,
          myBranch,
          general,
          allRooms: allRooms || [],
        });
      } else {
        // Regular user - only their specific rooms
        await createUserRoomsIfNeeded(currentUser);
        
        // Get class room
        const { data: classRoom } = await supabase
          .from('rooms')
          .select('*')
          .eq('type', 'class')
          .eq('year', currentUser.year)
          .eq('branch', currentUser.branch)
          .single();

        // Get branch room
        const { data: branchRoom } = await supabase
          .from('rooms')
          .select('*')
          .eq('type', 'branch')
          .eq('branch', currentUser.branch)
          .single();

        // Get cross-branch rooms
        const { data: generalRooms } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_cross_branch', true)
          .order('name');

        setUserRooms({
          myClass: classRoom || null,
          myBranch: branchRoom || null,
          general: generalRooms || [],
        });
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  // Auto-create rooms if they don't exist
  const createUserRoomsIfNeeded = async (currentUser: any) => {
    try {
      const yearText = getOrdinal(currentUser.year);
      const classRoomName = `${yearText} Year ${currentUser.branch}`;
      const branchRoomName = `${currentUser.branch} Branch`;

      // Create class room if doesn't exist
      await supabase
        .from('rooms')
        .upsert({
          name: classRoomName,
          type: 'class',
          branch: currentUser.branch,
          year: currentUser.year,
          is_cross_branch: false,
        }, {
          onConflict: 'name,type',
          ignoreDuplicates: true,
        });

      // Create branch room if doesn't exist
      await supabase
        .from('rooms')
        .upsert({
          name: branchRoomName,
          type: 'branch',
          branch: currentUser.branch,
          year: null,
          is_cross_branch: false,
        }, {
          onConflict: 'name,type',
          ignoreDuplicates: true,
        });
    } catch (error) {
      console.error('Error creating rooms:', error);
    }
  };

  // RULE 3: Full Message History (ALL messages from day 1)
  const loadAllMessages = async () => {
    if (!selectedRoom) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(name, profile_pic_url)
        `)
        .eq('room_id', selectedRoom.id)
        .order('created_at', { ascending: true }); // Oldest first

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // RULE 6: Send on Enter key OR Send button
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user || sending) return;

    setSending(true);

    try {
      // Get current auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('Not authenticated');
      }

      console.log('Auth user:', authUser.email);

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single();

      if (profileError || !profile) {
        console.error('Profile error:', profileError);
        console.error('Profile data:', profile);
        throw new Error('User profile not found');
      }

      console.log('Profile found:', profile.id);

      // Insert message with correct user_id
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: selectedRoom.id,
          user_id: profile.id,
          content: newMessage.trim(),
        });

      if (error) {
        console.error('Message insert error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('Message sent successfully');
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(`Failed to send message: ${error.message || 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // RULE 2: Click = Auto Enter
  const enterRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <h1 className="text-2xl font-bold text-orange-500">
          {selectedRoom ? selectedRoom.name : '💬 Discussion Rooms'}
        </h1>
        {selectedRoom && (
          <button
            onClick={() => setSelectedRoom(null)}
            className="text-sm text-gray-400 hover:text-white mt-1"
          >
            ← Back to rooms
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {!selectedRoom ? (
          /* Rooms List */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* My Rooms Section */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">My Rooms</h2>
                <div className="space-y-3">
                  
                  {/* My Class Room */}
                  {userRooms.myClass && (
                    <button
                      onClick={() => enterRoom(userRooms.myClass!)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🎓</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">My Class</h3>
                          <p className="text-sm text-gray-400">{userRooms.myClass.name}</p>
                        </div>
                        <div className="text-gray-400">→</div>
                      </div>
                    </button>
                  )}

                  {/* My Branch Room */}
                  {userRooms.myBranch && (
                    <button
                      onClick={() => enterRoom(userRooms.myBranch!)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🏢</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">My Branch</h3>
                          <p className="text-sm text-gray-400">{userRooms.myBranch.name}</p>
                        </div>
                        <div className="text-gray-400">→</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* General Rooms Section */}
              {userRooms.general.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">General</h2>
                  <div className="space-y-3">
                    {userRooms.general.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => enterRoom(room)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🌐</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{room.name}</h3>
                            <p className="text-sm text-gray-400">Cross-branch room</p>
                          </div>
                          <div className="text-gray-400">→</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* RULE 5: Owner GOD MODE - All Rooms Section */}
              {isOwnerUser(user) && userRooms.allRooms && (
                <div>
                  <h2 className="text-lg font-semibold text-yellow-400 mb-3">👑 All Rooms (GOD MODE)</h2>
                  <div className="space-y-3">
                    {userRooms.allRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => enterRoom(room)}
                        className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 hover:bg-yellow-500/20 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">
                            {room.type === 'class' ? '🎓' : 
                             room.type === 'branch' ? '🏢' : 
                             room.is_cross_branch ? '🌐' : '👥'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{room.name}</h3>
                            <p className="text-sm text-gray-400">
                              {room.type === 'class' ? `Class Room (${room.year}${['st', 'nd', 'rd', 'th'][room.year! - 1]} Year)` :
                               room.type === 'branch' ? 'Branch Room' :
                               room.is_cross_branch ? 'Cross-branch Room' : 'Other Room'}
                            </p>
                          </div>
                          <div className="text-yellow-400">→</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!userRooms.myClass && !userRooms.myBranch && userRooms.general.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400">No rooms available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Rooms will be created automatically based on your year and branch
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">💬</div>
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">Be the first to say something!</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <img
                        src={message.user.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user.name)}&background=f97316&color=fff`}
                        alt={message.user.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{message.user.name}</span>
                          <span className="text-xs text-gray-500">{timeAgo(message.created_at)}</span>
                        </div>
                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3">
                          <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.image_url && (
                            <img
                              src={message.image_url}
                              alt="Message"
                              className="mt-2 rounded-lg max-h-64 object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Auto-scroll target */}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] p-4">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Press Enter to send)"
                  className="flex-1 bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-4 py-3">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          <Link href="/feed" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">🏠</span>
            <span className="text-xs">Feed</span>
          </Link>
          <Link href="/rooms" className="flex flex-col items-center gap-1 text-orange-500">
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
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <span className="text-2xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}