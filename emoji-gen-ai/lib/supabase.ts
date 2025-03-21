import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database
export type User = {
  id: string;
  email: string;
  credits: number;
  created_at: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
};

export type Emoji = {
  id: string;
  user_id: string;
  likes_num: number;
  url: string;
  prompt: string;
  created_at: string;
}; 