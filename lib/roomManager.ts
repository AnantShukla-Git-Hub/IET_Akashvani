import { supabase } from './supabase';
import { CROSS_BRANCH_ROOMS } from './constants';

/**
 * Room Manager - Handles discussion room creation and assignment
 */

export interface RoomAssignment {
  classRoom: string; // e.g., "3rd Year CSE Regular"
  branchRoom: string; // e.g., "CSE Regular Branch"
  crossBranchRooms: string[]; // All cross-branch rooms
}

/**
 * Get or create a room by name and type
 */
async function getOrCreateRoom(
  name: string,
  type: 'class' | 'branch' | 'cross-branch' | 'alumni',
  branch?: string,
  year?: number
) {
  // Check if room exists
  const { data: existingRoom } = await supabase
    .from('rooms')
    .select('*')
    .eq('name', name)
    .eq('type', type)
    .single();

  if (existingRoom) {
    return existingRoom;
  }

  // Create new room
  const { data: newRoom, error } = await supabase
    .from('rooms')
    .insert({
      name,
      type,
      branch: branch || null,
      year: year || null,
      is_cross_branch: type === 'cross-branch',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }

  return newRoom;
}

/**
 * Create all cross-branch rooms (run once on app initialization)
 */
export async function initializeCrossBranchRooms() {
  try {
    for (const room of CROSS_BRANCH_ROOMS) {
      await getOrCreateRoom(room.name, 'cross-branch');
    }
    console.log('Cross-branch rooms initialized');
  } catch (error) {
    console.error('Error initializing cross-branch rooms:', error);
  }
}

/**
 * Get room assignments for a user based on their year and branch
 */
export async function getUserRoomAssignments(
  year: number,
  branch: string
): Promise<RoomAssignment> {
  // Class room name: "3rd Year CSE Regular"
  const yearText = ['1st', '2nd', '3rd', '4th'][year - 1] || `${year}th`;
  const classRoomName = `${yearText} Year ${branch}`;

  // Branch room name: "CSE Regular Branch"
  const branchRoomName = `${branch} Branch`;

  // Get or create class room
  await getOrCreateRoom(classRoomName, 'class', branch, year);

  // Get or create branch room
  await getOrCreateRoom(branchRoomName, 'branch', branch);

  // Cross-branch rooms (all users get access)
  const crossBranchRoomNames = CROSS_BRANCH_ROOMS.map((r) => r.name);

  return {
    classRoom: classRoomName,
    branchRoom: branchRoomName,
    crossBranchRooms: crossBranchRoomNames,
  };
}

/**
 * Get all rooms a user has access to
 */
export async function getUserRooms(userId: string) {
  // Get user details
  const { data: user } = await supabase
    .from('users')
    .select('year, branch, is_alumni')
    .eq('id', userId)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  const rooms = [];

  if (user.is_alumni) {
    // Alumni only get alumni room and cross-branch rooms
    const { data: alumniRooms } = await supabase
      .from('rooms')
      .select('*')
      .or('type.eq.alumni,type.eq.cross-branch');

    return alumniRooms || [];
  }

  // Get class room (e.g., "3rd Year CSE Regular")
  const yearText = ['1st', '2nd', '3rd', '4th'][user.year - 1] || `${user.year}th`;
  const classRoomName = `${yearText} Year ${user.branch}`;

  const { data: classRoom } = await supabase
    .from('rooms')
    .select('*')
    .eq('name', classRoomName)
    .eq('type', 'class')
    .single();

  if (classRoom) rooms.push(classRoom);

  // Get branch room (e.g., "CSE Regular Branch")
  const branchRoomName = `${user.branch} Branch`;

  const { data: branchRoom } = await supabase
    .from('rooms')
    .select('*')
    .eq('name', branchRoomName)
    .eq('type', 'branch')
    .single();

  if (branchRoom) rooms.push(branchRoom);

  // Get all cross-branch rooms
  const { data: crossBranchRooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('type', 'cross-branch');

  if (crossBranchRooms) rooms.push(...crossBranchRooms);

  return rooms;
}

/**
 * Create alumni room (run once)
 */
export async function initializeAlumniRoom() {
  try {
    await getOrCreateRoom('IET Alumni', 'alumni');
    console.log('Alumni room initialized');
  } catch (error) {
    console.error('Error initializing alumni room:', error);
  }
}

/**
 * Initialize all rooms (run once on app setup)
 */
export async function initializeAllRooms() {
  await initializeCrossBranchRooms();
  await initializeAlumniRoom();
}
