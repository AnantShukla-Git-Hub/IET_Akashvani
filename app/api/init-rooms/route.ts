import { NextResponse } from 'next/server';
import { initializeAllRooms } from '@/lib/roomManager';

/**
 * Initialize all discussion rooms
 * Run this once after deployment
 * GET /api/init-rooms?secret=your_admin_secret
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Verify admin secret
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeAllRooms();
    
    return NextResponse.json({
      success: true,
      message: 'All rooms initialized successfully',
    });
  } catch (error: any) {
    console.error('Error initializing rooms:', error);
    return NextResponse.json(
      { error: 'Failed to initialize rooms', details: error.message },
      { status: 500 }
    );
  }
}
