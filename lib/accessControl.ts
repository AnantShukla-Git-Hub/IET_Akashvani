/**
 * Access Control Utilities
 * Manages permissions for special users
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
}

/**
 * Get permissions based on access level
 */
export function getPermissions(accessLevel: AccessLevel): AccessPermissions {
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
  // Banned users can't do anything
  if (user.is_banned) return false;

  // Regular IET students have full access
  if (!user.is_special_user) return true;

  // Special users - check their access level
  const permissions = getPermissions(user.access_level);
  return permissions[action];
}

/**
 * Get user badge/label for display
 */
export function getUserBadge(user: any): string | null {
  if (user.is_banned) return 'BLOCKED';
  if (user.is_special_user) return user.special_user_role;
  if (user.is_alumni) return 'Alumni';
  return null;
}

/**
 * Get badge color class
 */
export function getBadgeColor(badge: string | null): string {
  switch (badge) {
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
