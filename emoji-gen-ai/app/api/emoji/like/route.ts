import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { toggleLikeEmoji } from '@/lib/emoji-service';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { emojiId, like } = await req.json();
    if (!emojiId) {
      return NextResponse.json({ error: 'Emoji ID is required' }, { status: 400 });
    }

    // Toggle like
    await toggleLikeEmoji(emojiId, like);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in emoji like API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 