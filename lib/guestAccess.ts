/**
 * Guest Access Utilities
 */

export interface GuestSession {
  isGuest: boolean;
  loginTime?: string;
}

/**
 * Check if current session is a guest session
 */
export function isGuestSession(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('guest_session') === 'true';
}

/**
 * Get guest session info
 */
export function getGuestSession(): GuestSession {
  if (typeof window === 'undefined') {
    return { isGuest: false };
  }

  const isGuest = localStorage.getItem('guest_session') === 'true';
  const loginTime = localStorage.getItem('guest_login_time') || undefined;

  return {
    isGuest,
    loginTime,
  };
}

/**
 * Clear guest session
 */
export function clearGuestSession(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('guest_session');
  localStorage.removeItem('guest_login_time');
}

/**
 * Check if guest access is enabled
 */
export function isGuestAccessEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('guest_access_enabled') === 'true';
}

/**
 * Validate guest access code
 */
export function validateGuestCode(code: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const validCode = localStorage.getItem('guest_access_code');
  return code.toUpperCase() === validCode;
}

/**
 * Check if user can perform write actions (not guest)
 */
export function canPerformWriteActions(): boolean {
  return !isGuestSession();
}

/**
 * Get guest restrictions for UI
 */
export function getGuestRestrictions() {
  const isGuest = isGuestSession();
  
  return {
    canPost: !isGuest,
    canComment: !isGuest,
    canLike: !isGuest,
    canMessage: !isGuest,
    canSubmitAchievement: !isGuest,
    canCreateAnnouncement: !isGuest,
    showWriteUI: !isGuest,
  };
}