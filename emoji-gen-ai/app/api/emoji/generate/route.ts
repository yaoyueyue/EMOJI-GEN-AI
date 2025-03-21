import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { generateEmoji } from '@/lib/replicate';
import { createOrGetUser } from '@/lib/user-service';
import { saveEmoji } from '@/lib/emoji-service';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User information not found' }, { status: 400 });
    }

    const email = user.emailAddresses[0].emailAddress;

    // Get request body
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Create or get user in Supabase
    await createOrGetUser(userId, email);

    // Generate emoji using Replicate
    const imageUrls = await generateEmoji(prompt);
    
    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to generate emoji' }, { status: 500 });
    }

    // Save the first generated emoji to Supabase
    const emoji = await saveEmoji(userId, prompt, imageUrls[0]);
    
    return NextResponse.json({ emoji });
  } catch (error: any) {
    console.error('Error in emoji generation API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 