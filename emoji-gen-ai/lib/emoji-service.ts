import { supabase, Emoji } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Upload emoji to Supabase storage
async function uploadEmoji(imageUrl: string, userId: string): Promise<string> {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    
    // Generate a unique filename
    const filename = `${uuidv4()}.png`;
    const filePath = `${userId}/${filename}`;
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('emojis')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      });
    
    if (error) {
      console.error('Error uploading emoji:', error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('emojis')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadEmoji:', error);
    throw error;
  }
}

// Save emoji to database
export async function saveEmoji(
  userId: string, 
  prompt: string, 
  imageUrl: string
): Promise<Emoji> {
  try {
    // Upload to Supabase storage first
    const storedImageUrl = await uploadEmoji(imageUrl, userId);
    
    // Create emoji record
    const emojiData = {
      id: uuidv4(),
      user_id: userId,
      likes_num: 0,
      url: storedImageUrl,
      prompt: prompt,
    };
    
    const { data, error } = await supabase
      .from('emojis')
      .insert([emojiData])
      .select()
      .single();
    
    if (error) {
      console.error('Error saving emoji:', error);
      throw error;
    }
    
    return data as Emoji;
  } catch (error) {
    console.error('Error in saveEmoji:', error);
    throw error;
  }
}

// Get user's emojis
export async function getUserEmojis(userId: string): Promise<Emoji[]> {
  const { data, error } = await supabase
    .from('emojis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user emojis:', error);
    throw error;
  }
  
  return data as Emoji[];
}

// Toggle like on emoji
export async function toggleLikeEmoji(emojiId: string, increment: boolean): Promise<void> {
  // Get current likes count
  const { data: emoji, error: fetchError } = await supabase
    .from('emojis')
    .select('likes_num')
    .eq('id', emojiId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching emoji likes:', fetchError);
    throw fetchError;
  }
  
  // Calculate new likes count
  const currentLikes = emoji?.likes_num || 0;
  const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
  
  // Update likes count
  const { error: updateError } = await supabase
    .from('emojis')
    .update({ likes_num: newLikes })
    .eq('id', emojiId);
  
  if (updateError) {
    console.error('Error updating emoji likes:', updateError);
    throw updateError;
  }
} 