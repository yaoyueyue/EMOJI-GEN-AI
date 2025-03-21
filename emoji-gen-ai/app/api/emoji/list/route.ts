import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserEmojis } from '@/lib/emoji-service';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's emojis
    const emojis = await getUserEmojis(userId);
    
    return NextResponse.json({ emojis });
  } catch (error: any) {
    console.error('Error in list emojis API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 