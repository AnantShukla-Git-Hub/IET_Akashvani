import { BRANCH_CODES } from './studentData';

/**
 * IET Lucknow Roll Number Parser
 * 
 * Format: 2500520100112 (13 digits)
 * - Position 0-1: Year (25 = 2025)
 * - Position 2-10: 9-digit branch code
 * - Position 11-12: Class roll number
 * 
 * Branch codes (middle 9 digits):
 * - 005200000 = Civil Engineering (CE)
 * - 005201000 = CS Regular (CSR)
 * - 005201001 = CS Self Finance (CSSF)
 * - 005215200 = CS AI (CSAI)
 * - 005203100 = ECE
 * - 005202000 = EE
 * - 005204000 = ME
 * - 005205100 = Chemical Engineering (CHE)
 */

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
    
    // Extract branch code (position 2-10, 9 digits)
    const branchCode = cleanRollNumber.substring(2, 11);
    const branch = BRANCH_CODES[branchCode];
    
    if (!branch) {
      return {
        isValid: false,
        admissionYear,
        currentYear,
        branch: null,
        branchCode,
        classRollNumber: null,
        error: `Unknown branch code: ${branchCode}. This might be a new branch. Contact admin.`,
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
 */
export function shouldBeAlumni(admissionYear: number): boolean {
  const currentAcademicYear = getCurrentAcademicYear();
  const yearsSinceAdmission = currentAcademicYear - admissionYear + 1;
  return yearsSinceAdmission > 4;
}

/**
 * Format roll number for display
 * Example: 2500520100112 → 25-005201001-12
 */
export function formatRollNumber(rollNumber: string): string {
  const clean = rollNumber.trim();
  if (clean.length !== 13) return rollNumber;
  
  return `${clean.substring(0, 2)}-${clean.substring(2, 11)}-${clean.substring(11, 13)}`;
}

/**
 * Validate roll number (quick check)
 */
export function isValidRollNumber(rollNumber: string): boolean {
  const parsed = parseRollNumber(rollNumber);
  return parsed.isValid;
}
