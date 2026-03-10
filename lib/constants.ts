// IET Akashvani Constants

export const ALLOWED_EMAIL_DOMAIN = '@ietlucknow.ac.in';

// Academic year starts in August
export const ACADEMIC_YEAR_START_MONTH = 8;

export const BADGE_LEVELS = {
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze',
} as const;

export const DESIGNATION_TYPES = {
  // Hostel
  CHIEF_WARDEN: 'Chief Warden',
  WARDEN: 'Warden',
  MESS_INCHARGE: 'Mess Incharge',
  HOSTEL_SUPERVISOR: 'Hostel Supervisor',
  
  // Academic
  DIRECTOR: 'Director',
  REGISTRAR: 'Registrar',
  DEAN_ACADEMICS: 'Dean Academics',
  DEAN_STUDENT_WELFARE: 'Dean Student Welfare',
  HOD: 'HOD',
  FACULTY: 'Faculty/Professor',
  
  // Placement
  TPO: 'TPO',
  ASST_TPO: 'Assistant TPO',
  PLACEMENT_COORDINATOR: 'Placement Coordinator',
  
  // Student
  CLASS_CR: 'Class CR',
  CULTURAL_SEC: 'Cultural Secretary',
  SPORTS_SEC: 'Sports Secretary',
  CLUB_HEAD: 'Club Head',
  FEST_COORDINATOR: 'Fest Coordinator',
  
  // Other
  LIBRARY_INCHARGE: 'Library Incharge',
  MEDICAL_OFFICER: 'Medical Officer',
  EXAMINATION_CELL: 'Examination Cell',
  CUSTOM: 'Custom',
} as const;

// Branch codes mapping (position 8 in roll number)
export const BRANCH_CODES: Record<string, string> = {
  '0': 'CSE Regular',
  '1': 'CSE Self Finance',
  '2': 'CSE AI',
  // Add more as confirmed:
  // '3': 'ECE',
  // '4': 'EE',
  // '5': 'MECH',
  // '6': 'CIVIL',
};

export const BRANCHES = [
  'CSE Regular',
  'CSE Self Finance',
  'CSE AI',
  'ECE',
  'EE',
  'MECH',
  'CIVIL',
] as const;

export const YEARS = [1, 2, 3, 4] as const;

// Hostels (configurable - add more as confirmed)
export const HOSTELS = [
  'Ramanujan',
  'Aryabhatta',
  'Vishwakaraya',
  'Bhabha',
  'KN',
  // More to be added
] as const;

// Hostel details with year assignments
export const HOSTEL_DETAILS = {
  BOYS: [
    { id: 'ramanujan', name: 'Ramanujan', defaultYear: 1 },
    { id: 'aryabhatta', name: 'Aryabhatta', defaultYear: 2 },
    { id: 'vishwakaraya', name: 'Vishwakaraya', defaultYear: null },
    { id: 'bhabha', name: 'Bhabha', defaultYear: null },
    { id: 'kn', name: 'KN', defaultYear: null },
  ],
  GIRLS: [
    // Add girls hostels as confirmed
  ],
} as const;

export const CROSS_BRANCH_ROOMS = [
  { id: 'placement', name: '💼 Placement & Internship', emoji: '💼' },
  { id: 'mess', name: '🍽️ Mess & Hostel', emoji: '🍽️' },
  { id: 'exam', name: '📚 Exam & Results', emoji: '📚' },
  { id: 'research', name: '🔬 Research & Projects', emoji: '🔬' },
  { id: 'clubs', name: '🎨 Clubs & Fests', emoji: '🎨' },
  { id: 'lost-found', name: '🔍 Lost & Found', emoji: '🔍' },
  { id: 'gate', name: '📖 GATE Prep', emoji: '📖' },
  { id: 'emergency', name: '🚨 Emergency', emoji: '🚨' },
] as const;

export const PROMOTE_CATEGORIES = [
  { id: 'tutoring', name: '📚 Tutoring & Notes', emoji: '📚' },
  { id: 'design', name: '🎨 Design & Creative', emoji: '🎨' },
  { id: 'tech', name: '💻 Tech & Coding', emoji: '💻' },
  { id: 'music', name: '🎵 Music & Arts', emoji: '🎵' },
  { id: 'photography', name: '📸 Photography', emoji: '📸' },
  { id: 'fitness', name: '🏋️ Fitness & Sports', emoji: '🏋️' },
  { id: 'content', name: '📝 Content & Writing', emoji: '📝' },
  { id: 'repair', name: '🔧 Repair & Other', emoji: '🔧' },
] as const;

export const ACHIEVEMENT_TYPES = [
  'Internship',
  'Competition',
  'Research',
  'Sports',
  'Arts',
  'Other',
] as const;

export const VIBE_MOODS = [
  { id: 'crazy', name: '🔴 Crazy/Hype', color: 'from-red-500 to-orange-500' },
  { id: 'soothing', name: '💜 Soothing', color: 'from-blue-500 to-purple-500' },
  { id: 'good', name: '🟡 Good Mood', color: 'from-yellow-400 to-green-400' },
  { id: 'sad', name: '🔵 Sad/Emotional', color: 'from-blue-900 to-gray-700' },
  { id: 'study', name: '📚 Study Mode', color: 'from-white to-blue-400' },
  { id: 'party', name: '🎉 Party Mode', color: 'from-pink-500 via-purple-500 to-blue-500' },
] as const;
