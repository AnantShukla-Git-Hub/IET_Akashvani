/**
 * Utility Functions
 */

import imageCompression from 'browser-image-compression';

/**
 * Format time ago (e.g., "2 mins ago", "1 hour ago")
 */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Compress image before upload
 * Target: under 200KB
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.2, // 200KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file; // Return original if compression fails
  }
}

/**
 * Format number with K, M suffix
 */
export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

/**
 * Extract mentions from text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.substring(1)) : [];
}

/**
 * Linkify text (convert URLs to links)
 */
export function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-orange-500 hover:underline">$1</a>');
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, 4th)
 */
export function getOrdinal(num: number | null | undefined): string {
  if (num === null || num === undefined) return '';
  
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

/**
 * Format user year and branch display
 * Examples:
 * - "1st Year • CS Self Finance"
 * - "CS Self Finance" (if no year)
 * - "IET Lucknow" (if no branch)
 * - "" (if both null)
 */
export function formatYearBranch(year: number | null | undefined, branch: string | null | undefined): string {
  if (!year && !branch) return 'IET Lucknow';
  if (!year && branch) return branch;
  if (year && !branch) return `${getOrdinal(year)} Year`;
  return `${getOrdinal(year)} Year • ${branch}`;
}
