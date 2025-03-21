import { supabase, User } from './supabase';

// Create or get user in Supabase
export async function createOrGetUser(userId: string, email: string): Promise<User> {
  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 is the error code for "no rows returned" which is expected if user doesn't exist
    console.error('Error fetching user:', fetchError);
    throw fetchError;
  }

  // If user exists, return it
  if (existingUser) {
    return existingUser as User;
  }

  // Otherwise, create new user
  const newUser = {
    id: userId,
    email: email,
    credits: 10, // Default credits as per schema
  };

  const { data, error } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data as User;
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }

  return data as User;
} 