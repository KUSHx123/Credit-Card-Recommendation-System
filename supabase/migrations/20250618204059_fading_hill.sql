/*
  # Credit Card Advisor Database Schema Setup

  1. New Tables
    - `user_profiles` - Store user financial profiles and preferences
    - `chat_sessions` - Track AI conversation sessions
    - `chat_messages` - Store individual messages in conversations
    - `credit_cards` - Store credit card information and features

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Allow public read access to credit cards

  3. Features
    - UUID primary keys with auto-generation
    - Proper foreign key relationships
    - Timestamps for audit trails
    - JSONB for flexible data storage
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income INTEGER,
  spending_habits JSONB,
  preferred_benefits TEXT[],
  credit_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assistant_id TEXT,
  thread_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit cards table
CREATE TABLE IF NOT EXISTS credit_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image_url TEXT,
  joining_fee INTEGER DEFAULT 0,
  annual_fee INTEGER DEFAULT 0,
  reward_type TEXT NOT NULL,
  reward_rate DECIMAL,
  min_income INTEGER,
  min_credit_score INTEGER,
  special_perks TEXT[],
  categories JSONB,
  features TEXT[],
  apply_link TEXT,
  welcome_bonus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can manage their own profiles" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can manage their own chat sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can access messages from their sessions" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Create RLS policies for credit_cards
CREATE POLICY "Anyone can read credit cards" ON credit_cards
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_cards_issuer ON credit_cards(issuer);
CREATE INDEX IF NOT EXISTS idx_credit_cards_min_income ON credit_cards(min_income);