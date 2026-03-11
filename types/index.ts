// IET Akashvani Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  roll_number: string;
  year: number;
  branch: string;
  college: string;
  profile_pic_url: string;
  serial_id: string;
  is_alumni: boolean;
  batch_year?: number;
  is_banned: boolean;
  is_guest: boolean;
  is_special_user: boolean;
  special_user_role?: 'Guest' | 'Faculty' | 'Special' | 'Alumni';
  access_level: 'read_only' | 'can_post' | 'full';
  added_by?: string;
  blocked_reason?: string;
  blocked_at?: string;
  created_at: string;
}

export interface Designation {
  id: string;
  user_id: string;
  designation_title: string;
  unit?: string;
  badge_level: 'gold' | 'silver' | 'bronze';
  custom_tag?: string;
  expiry_type: 'permanent' | 'annual';
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  type: 'feed' | 'announcement' | 'achievement' | 'promote';
  image_url?: string;
  is_anonymous: boolean;
  expires_at?: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface Room {
  id: string;
  name: string;
  type: 'class' | 'branch' | 'cross-branch' | 'alumni';
  branch?: string;
  year?: number;
  is_cross_branch: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  expires_at?: string;
  created_at: string;
  user?: User;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  type: string;
  proof_image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  created_at: string;
  user?: User;
}

export interface Promotion {
  id: string;
  user_id: string;
  category: string;
  description: string;
  price?: string;
  contact_email: string;
  expires_at: string;
  created_at: string;
  user?: User;
}

export interface Vibe {
  id: string;
  user_id: string;
  spotify_link: string;
  song_name: string;
  artist: string;
  album_art_url?: string;
  preview_url?: string;
  mood: string;
  expires_at: string;
  created_at: string;
  user?: User;
}

export interface Tag {
  id: string;
  post_id: string;
  tag_type: 'role' | 'user' | 'topic';
  tag_value: string;
  notified_user_id?: string;
  notified: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  post_id: string;
  reported_by: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'action_taken';
  created_at: string;
}

export type BadgeLevel = 'gold' | 'silver' | 'bronze';
export type Branch = 'Civil Engineering' | 'CS Regular' | 'CS Self Finance' | 'CS AI' | 'ECE' | 'EE' | 'ME' | 'Chemical Engineering';
export type Year = 1 | 2 | 3 | 4;
