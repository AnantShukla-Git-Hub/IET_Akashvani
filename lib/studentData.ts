/**
 * IET Lucknow Student Data
 * 
 * IMPORTANT: Roll numbers are NOT used for authentication!
 * Authentication is ONLY via Google OAuth (@ietlucknow.ac.in)
 * 
 * Roll numbers are used for:
 * - Detecting branch
 * - Detecting batch year
 * - Filling profile info
 * - Reference only
 * 
 * Cost: ₹0 forever (no database storage)
 */

/**
 * Branch Codes (middle 9 digits of roll number)
 * Position 2-10 in 13-digit roll number
 */
export const BRANCH_CODES: Record<string, string> = {
  '005200000': 'Civil Engineering',
  '005201000': 'CS Regular',
  '005201001': 'CS Self Finance',
  '005215200': 'CS AI',
  '005203100': 'ECE',
  '005202000': 'EE',
  '005204000': 'ME',
  '005205100': 'Chemical Engineering',
};

/**
 * Branch Code Abbreviations
 */
export const BRANCH_ABBR: Record<string, string> = {
  '005200000': 'CE',
  '005201000': 'CSR',
  '005201001': 'CSSF',
  '005215200': 'CSAI',
  '005203100': 'ECE',
  '005202000': 'EE',
  '005204000': 'ME',
  '005205100': 'CHE',
};

/**
 * 2025 Batch Roll Numbers (Reference Only - NOT for authentication)
 * Will be populated later
 */
export const BATCH_2025_ROLLS: string[] = [
  // Add roll numbers here for reference
  // Example: "2500520100112",
  // NOT used for authentication
  // Just for reference/statistics
];

/**
 * 2024 Batch Roll Numbers (Reference Only)
 */
export const BATCH_2024_ROLLS: string[] = [
  // Add roll numbers here
];

/**
 * 2023 Batch Roll Numbers (Reference Only)
 */
export const BATCH_2023_ROLLS: string[] = [
  // Add roll numbers here
];

/**
 * 2022 Batch Roll Numbers (Reference Only)
 */
export const BATCH_2022_ROLLS: string[] = [
  // Add roll numbers here
];

/**
 * Detect branch from roll number
 * @param roll - 13-digit roll number
 * @returns Branch name or null if unknown
 */
export function detectBranch(roll: string): string | null {
  if (roll.length !== 13) return null;
  
  // Extract branch code (position 2-10, 9 digits)
  const branchCode = roll.substring(2, 11);
  
  return BRANCH_CODES[branchCode] || null;
}

/**
 * Detect year from roll number
 * @param roll - 13-digit roll number
 * @returns Current study year (1-4) or null if invalid
 */
export function detectYear(roll: string): number | null {
  if (roll.length !== 13) return null;
  
  try {
    // Extract year code (position 0-1)
    const yearCode = roll.substring(0, 2);
    const admissionYear = 2000 + parseInt(yearCode);
    
    // Calculate current study year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Academic year starts in August
    const currentAcademicYear = currentMonth < 8 ? currentYear - 1 : currentYear;
    
    const studyYear = currentAcademicYear - admissionYear + 1;
    
    // Return year (1-4) or null if out of range
    if (studyYear < 1 || studyYear > 4) return null;
    
    return studyYear;
  } catch (error) {
    return null;
  }
}

/**
 * Detect class roll number from roll number
 * @param roll - 13-digit roll number
 * @returns Class roll number (last 2 digits) or null if invalid
 */
export function detectClassRoll(roll: string): string | null {
  if (roll.length !== 13) return null;
  
  // Extract class roll (position 11-12, last 2 digits)
  return roll.substring(11, 13);
}

/**
 * Get branch abbreviation
 */
export function getBranchAbbr(roll: string): string | null {
  if (roll.length !== 13) return null;
  
  const branchCode = roll.substring(2, 11);
  return BRANCH_ABBR[branchCode] || null;
}

/**
 * Get all valid roll numbers (for reference only)
 */
export function getAllRollNumbers(): string[] {
  return [
    ...BATCH_2025_ROLLS,
    ...BATCH_2024_ROLLS,
    ...BATCH_2023_ROLLS,
    ...BATCH_2022_ROLLS,
  ];
}

/**
 * Get count of registered students (for statistics)
 */
export function getStudentCount(): number {
  return getAllRollNumbers().length;
}

/**
 * Check if roll number format is valid (13 digits)
 * NOTE: This does NOT authenticate the user!
 * Authentication is ONLY via Google OAuth
 */
export function isValidRollNumberFormat(roll: string): boolean {
  return /^\d{13}$/.test(roll.trim());
}
