import { BRANCH_CODES } from './constants';

/**
 * IET Lucknow Roll Number Parser
 * 
 * Format: 2500520100112 (13 digits)
 * - Position 0-1: Year admitted (25 = 2025)
 * - Position 2-4: College code (005)
 * - Position 7: Branch code (NEEDS VERIFICATION - see note below)
 * - Position 11-12: Class roll number
 * 
 * IMPORTANT - BRANCH CODE POSITION VERIFICATION NEEDED:
 * Current implementation uses position 7 for branch code.
 * Example: 2500520100112
 *          Position 7 = 1 (CSE Self Finance)
 * 
 * However, position needs final confirmation from Anant.
 * Please test with a CSE Regular student roll (branch code should be 0).
 * If position 7 is wrong, change BRANCH_CODE_POSITION constant below.
 * 
 * Possible positions: 7, 8, or 10
 */

// CONFIGURABLE: Change this if branch code position is different
const BRANCH_CODE_POSITION = 7;

export interface ParsedRollNumber {
  isValid: boolean;
  admissionYear: number | null;
  currentYear: number | null;
  branch: string | null;
  branchCode: string | null;
  classRollNumber: string | null;
  error?: string;
}

/**
 * Get current academic year
 * Academic year starts in August
 * Example: If current date is July 2025 → 2024-25 academic year
 *          If current date is August 2025 → 2025-26 academic year
 */
export function getCurrentAcademicYear(): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // If before August, we're still in previous academic year
  if (currentMonth < 8) {
    return currentYear - 1;
  }
  
  return currentYear;
}

/**
 * Calculate current study year based on admission year
 * Example: Admitted in 2025, current academic year 2025-26 → 1st year
 *          Admitted in 2025, current academic year 2026-27 → 2nd year
 */
export function calculateStudyYear(admissionYear: number): number {
  const currentAcademicYear = getCurrentAcademicYear();
  const studyYear = currentAcademicYear - admissionYear + 1;
  
  // Clamp between 1-4 (or mark as alumni if > 4)
  if (studyYear > 4) return 4; // Will be marked as alumni
  if (studyYear < 1) return 1;
  
  return studyYear;
}

/**
 * Parse IET Lucknow roll number
 */
export function parseRollNumber(rollNumber: string): ParsedRollNumber {
  // Remove spaces and convert to uppercase
  const cleanRollNumber = rollNumber.trim().toUpperCase();
  
  // Validate length (should be 13 digits)
  if (cleanRollNumber.length !== 13) {
    return {
      isValid: false,
      admissionYear: null,
      currentYear: null,
      branch: null,
      branchCode: null,
      classRollNumber: null,
      error: 'Roll number must be 13 digits',
    };
  }
  
  // Validate all characters are digits
  if (!/^\d+$/.test(cleanRollNumber)) {
    return {
      isValid: false,
      admissionYear: null,
      currentYear: null,
      branch: null,
      branchCode: null,
      classRollNumber: null,
      error: 'Roll number must contain only digits',
    };
  }
  
  try {
    // Extract year (position 0-1)
    const yearCode = cleanRollNumber.substring(0, 2);
    const admissionYear = 2000 + parseInt(yearCode);
    
    // Calculate current study year
    const currentYear = calculateStudyYear(admissionYear);
    
    // Extract branch code (position configurable - see top of file)
    const branchCode = cleanRollNumber.charAt(BRANCH_CODE_POSITION);
    const branch = BRANCH_CODES[branchCode];
    
    if (!branch) {
      return {
        isValid: false,
        admissionYear,
        currentYear,
        branch: null,
        branchCode,
        classRollNumber: null,
        error: `Unknown branch code: ${branchCode}. Please contact admin to add this branch.`,
      };
    }
    
    // Extract class roll number (last 2 digits)
    const classRollNumber = cleanRollNumber.substring(11, 13);
    
    return {
      isValid: true,
      admissionYear,
      currentYear,
      branch,
      branchCode,
      classRollNumber,
    };
  } catch (error) {
    return {
      isValid: false,
      admissionYear: null,
      currentYear: null,
      branch: null,
      branchCode: null,
      classRollNumber: null,
      error: 'Invalid roll number format',
    };
  }
}

/**
 * Check if a student should be marked as alumni
 * Alumni = admitted more than 4 years ago
 */
export function shouldBeAlumni(admissionYear: number): boolean {
  const currentAcademicYear = getCurrentAcademicYear();
  const yearsSinceAdmission = currentAcademicYear - admissionYear + 1;
  return yearsSinceAdmission > 4;
}

/**
 * Format roll number for display
 * Example: 2500520100112 → 25-005-201-001-12
 */
export function formatRollNumber(rollNumber: string): string {
  const clean = rollNumber.trim();
  if (clean.length !== 13) return rollNumber;
  
  return `${clean.substring(0, 2)}-${clean.substring(2, 5)}-${clean.substring(5, 8)}-${clean.substring(8, 11)}-${clean.substring(11, 13)}`;
}

/**
 * Validate roll number (quick check)
 */
export function isValidRollNumber(rollNumber: string): boolean {
  const parsed = parseRollNumber(rollNumber);
  return parsed.isValid;
}
