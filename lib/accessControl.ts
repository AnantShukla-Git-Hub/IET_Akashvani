/**
 * Access Control Utilities
 * Manages permissions for special users and owner
 * 
 * OWNER (anantshukla836@gmail.com) = GOD MODE
 * - Can access EVERYTHING
 * - Can see anonymous post identities
 * - Can enter ALL rooms
 * - Can moderate everything
 * - Badge above all others
 */

export type AccessLevel = 'read_only' | 'can_post' | 'full';

export interface AccessPermissions {
  canView: boolean;
  canPost: boolean;
  canComment: boolean;
  canLike: boolean;
  canJoinRooms: boolean;
  canCreateAchievements: boolean;
  canPromote: boolean;
  canShareVibes: boolean;
  canSeeAnonymousIdentity: boolean;
  canAccessAllRooms: boolean;
  canSeeReports: boolean;
  canModerate: boolean;
}

/**
 * Check if user is the Owner (GOD MODE)
 * Owner = anantshukla836@gmail.com
 * Owner has UNLIMITED access to everything
 */
export function isOwner(user: any): boolean {
  if (!user) return false;
  
  // Check by email (primary check)
  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'anantshukla836@gmail.com';
  if (user.email === ownerEmail) return true;
  
  // Check by role
  if (user.role === 'owner') return true;
  
  // Check by can_see_anonymous flag
  if (user.can_see_anonymous === true) return true;
  
  return false;
}

/**
 * Check if user has access to something
 * OWNER ALWAYS RETURNS TRUE
 */
export function hasAccess(user: any): boolean {
  // OWNER = GOD MODE - Always has access
  if (isOwner(user)) return true;
  
  // Banned users have no access
  if (user?.is_banned) return false;
  
  // Everyone else has basic access
  return true;
}

/**
 * Check if user can see anonymous post identities
 * ONLY OWNER can see real identity
 * Everyone else (including Director/Gold badge) sees "Anonymous IETian"
 */
export function canSeeAnonymousIdentity(user: any): boolean {
  // ONLY OWNER can see anonymous identities
  if (isOwner(user)) return true;
  
  // Everyone else (including Director/Gold badge) CANNOT see
  return false;
}

/**
 * Check if user can enter a specific room
 * OWNER can enter ALL rooms
 * Director/Gold badge CANNOT enter private branch/year rooms
 */
export function canEnterRoom(user: any, room: any): boolean {
  // OWNER can enter EVERY room
  if (isOwner(user)) return true;
  
  // Banned users can't enter any room
  if (user?.is_banned) return false;

  // Cross-branch rooms - everyone can access
  if (room.is_cross_branch || room.type === 'cross-branch') return true;

  // Alumni room - only alumni can access
  if (room.type === 'alumni') {
    return user.is_alumni;
  }

  // Class rooms (e.g., "3rd Year CSE Regular")
  // ONLY students of that year+branch can enter
  // Director/Gold badge CANNOT enter unless they are that year+branch
  if (room.type === 'class') {
    return user.year === room.year && user.branch === room.branch;
  }

  // Branch rooms (e.g., "CSE Regular Branch")
  // ONLY students of that branch can enter
  // Director/Gold badge CANNOT enter unless they are that branch
  if (room.type === 'branch') {
    return user.branch === room.branch;
  }

  // Default: deny access
  return false;
}

/**
 * Check if user can view a post
 * OWNER can view ALL posts
 */
export function canViewPost(user: any, post: any): boolean {
  // OWNER can view EVERYTHING
  if (isOwner(user)) return true;
  
  // Banned users can't view anything
  if (user?.is_banned) return false;
  
  // Everyone else can view posts
  return true;
}

/**
 * Check if user can moderate content
 * ONLY OWNER can moderate
 */
export function canModerate(user: any): boolean {
  // ONLY OWNER can moderate
  if (isOwner(user)) return true;
  
  return false;
}

/**
 * Get permissions based on access level
 * Owner bypasses all restrictions
 */
export function getPermissions(user: any): AccessPermissions {
  // OWNER = GOD MODE - Can do EVERYTHING
  if (isOwner(user)) {
    return {
      canView: true,
      canPost: true,
      canComment: true,
      canLike: true,
      canJoinRooms: true,
      canCreateAchievements: true,
      canPromote: true,
      canShareVibes: true,
      canSeeAnonymousIdentity: true, // ONLY owner
      canAccessAllRooms: true, // ONLY owner
      canSeeReports: true, // ONLY owner
      canModerate: true, // ONLY owner
    };
  }

  // Banned users can't do anything
  if (user?.is_banned) {
    return {
      canView: false,
      canPost: false,
      canComment: false,
      canLike: false,
      canJoinRooms: false,
      canCreateAchievements: false,
      canPromote: false,
      canShareVibes: false,
      canSeeAnonymousIdentity: false,
      canAccessAllRooms: false,
      canSeeReports: false,
      canModerate: false,
    };
  }

  // Regular IET students have full access (except owner privileges)
  if (!user?.is_special_user) {
    return {
      canView: true,
      canPost: true,
      canComment: true,
      canLike: true,
      canJoinRooms: true,
      canCreateAchievements: true,
      canPromote: true,
      canShareVibes: true,
      canSeeAnonymousIdentity: false, // Regular users don't see identity
      canAccessAllRooms: false, // Regular users only see their rooms
      canSeeReports: false,
      canModerate: false,
    };
  }

  // Special users - check their access level
  const accessLevel = user.access_level || 'read_only';
  
  switch (accessLevel) {
    case 'read_only':
      return {
        canView: true,
        canPost: false,
        canComment: false,
        canLike: true,
        canJoinRooms: false,
        canCreateAchievements: false,
        canPromote: false,
        canShareVibes: false,
        canSeeAnonymousIdentity: false,
        canAccessAllRooms: false,
        canSeeReports: false,
        canModerate: false,
      };

    case 'can_post':
      return {
        canView: true,
        canPost: true,
        canComment: true,
        canLike: true,
        canJoinRooms: true,
        canCreateAchievements: false,
        canPromote: false,
        canShareVibes: false,
        canSeeAnonymousIdentity: false,
        canAccessAllRooms: false,
        canSeeReports: false,
        canModerate: false,
      };

    case 'full':
      return {
        canView: true,
        canPost: true,
        canComment: true,
        canLike: true,
        canJoinRooms: true,
        canCreateAchievements: true,
        canPromote: true,
        canShareVibes: true,
        canSeeAnonymousIdentity: false, // Even full access doesn't see identity
        canAccessAllRooms: false, // Even full access doesn't access all rooms
        canSeeReports: false,
        canModerate: false,
      };

    default:
      return {
        canView: false,
        canPost: false,
        canComment: false,
        canLike: false,
        canJoinRooms: false,
        canCreateAchievements: false,
        canPromote: false,
        canShareVibes: false,
        canSeeAnonymousIdentity: false,
        canAccessAllRooms: false,
        canSeeReports: false,
        canModerate: false,
      };
  }
}

/**
 * Check if user can perform an action
 */
export function canPerformAction(
  user: any,
  action: keyof AccessPermissions
): boolean {
  // OWNER can do EVERYTHING
  if (isOwner(user)) return true;
  
  // Banned users can't do anything
  if (user?.is_banned) return false;

  // Get permissions and check
  const permissions = getPermissions(user);
  return permissions[action];
}

/**
 * Check if user can access a specific room
 * Owner can access ALL rooms
 * Regular users can only access their year/branch rooms + cross-branch
 * Gold badge holders can access cross-branch but NOT other year/branch rooms
 */
export function canAccessRoom(user: any, room: any): boolean {
  return canEnterRoom(user, room);
}

/**
 * Get user badge/label for display
 * Owner badge is ABOVE all other badges
 */
export function getUserBadge(user: any): string | null {
  if (isOwner(user)) return 'OWNER'; // Highest badge - above all
  if (user?.is_banned) return 'BLOCKED';
  if (user?.is_special_user) return user.special_user_role;
  if (user?.is_alumni) return 'Alumni';
  return null;
}

/**
 * Get badge color class
 * Owner gets special gold gradient
 */
export function getBadgeColor(badge: string | null): string {
  switch (badge) {
    case 'OWNER':
      return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold shadow-lg'; // Special owner badge
    case 'BLOCKED':
      return 'bg-red-100 text-red-800';
    case 'Guest':
      return 'bg-blue-100 text-blue-800';
    case 'Faculty':
      return 'bg-purple-100 text-purple-800';
    case 'Special':
      return 'bg-green-100 text-green-800';
    case 'Alumni':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get post author display name
 * If anonymous:
 *   - Owner sees real name + "(Anonymous)"
 *   - Everyone else (including Director/Gold) sees "Anonymous IETian"
 */
export function getPostAuthorName(post: any, currentUser: any): string {
  // Not anonymous - show real name
  if (!post.is_anonymous) {
    return post.user?.name || 'Unknown User';
  }

  // Anonymous post
  // ONLY Owner sees real identity
  if (canSeeAnonymousIdentity(currentUser)) {
    return `${post.user?.name} (Anonymous)`;
  }

  // Everyone else (including Director/Gold badge) sees anonymous
  return 'Anonymous IETian';
}

/**
 * Get post author avatar
 * If anonymous and not owner, show generic avatar
 */
export function getPostAuthorAvatar(post: any, currentUser: any): string {
  // Not anonymous - show real avatar
  if (!post.is_anonymous) {
    return post.user?.profile_pic_url || '/default-avatar.png';
  }

  // Anonymous post
  // ONLY Owner sees real avatar
  if (canSeeAnonymousIdentity(currentUser)) {
    return post.user?.profile_pic_url || '/default-avatar.png';
  }

  // Everyone else sees generic anonymous avatar
  return '/anonymous-avatar.png';
}
