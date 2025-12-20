-- Daily Clarity - Supabase Database Schema
-- This schema is designed to work with the existing TypeScript implementation

-- =============================================
-- USER PROFILES TABLE
-- =============================================
-- Extended user data beyond Supabase auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,

  -- Personalization data (matches TypeScript types)
  communication_style TEXT, -- 'concise', 'warm', 'detailed', 'direct'
  common_themes JSONB DEFAULT '[]'::jsonb, -- array of strings
  stress_triggers JSONB DEFAULT '[]'::jsonb, -- array of strings
  decision_patterns JSONB DEFAULT '{}'::jsonb,

  -- Usage stats
  total_sessions INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONVERSATIONS TABLE
-- =============================================
-- Stores all user interactions with tools
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tool_type TEXT NOT NULL, -- 'mind-dump', 'find-words', 'decision-helper', 'write-hard', 'quick-reset'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Conversation data
  user_input TEXT NOT NULL,
  ai_response TEXT,
  follow_up_inputs JSONB DEFAULT '[]'::jsonb,

  -- Metadata for learning (extracted by AI)
  theme TEXT, -- 'work', 'relationships', 'health', 'finance', etc.
  mood_before TEXT, -- 'overwhelmed', 'stuck', 'anxious', etc.
  mood_after TEXT,
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  tags TEXT[] DEFAULT '{}', -- stress triggers mentioned

  -- Pattern recognition fields
  decision_type TEXT, -- 'career', 'personal', 'financial', etc.
  resolved BOOLEAN DEFAULT false
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_theme ON conversations(theme);

-- =============================================
-- USER INSIGHTS TABLE
-- =============================================
-- AI-generated patterns and insights
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  insight_type TEXT NOT NULL, -- 'recurring_pattern', 'trigger_pattern', 'growth_insight'
  insight_data JSONB NOT NULL, -- stores {title, pattern, suggestion, evidence_count}
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),

  -- Example insight_data structure:
  -- {
  --   "title": "Work Deadline Anxiety",
  --   "pattern": "You tend to feel overwhelmed about work on Mondays",
  --   "suggestion": "Consider using this tool Sunday evening to prep for the week",
  --   "evidence_count": 8
  -- }
);

CREATE INDEX IF NOT EXISTS idx_insights_user_id ON user_insights(user_id);

-- =============================================
-- TRAINING ANNOTATIONS TABLE (Optional - for beta testing)
-- =============================================
-- Used during training/testing phase to manually annotate quality
CREATE TABLE IF NOT EXISTS training_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Manual evaluation fields
  what_i_needed TEXT,
  what_was_helpful TEXT,
  what_was_missing TEXT,
  emotional_accuracy INTEGER CHECK (emotional_accuracy >= 1 AND emotional_accuracy <= 5),
  would_use_again BOOLEAN
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Critical for data privacy - users can only see their own data

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_annotations ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Conversations Policies
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- User Insights Policies
CREATE POLICY "Users can view own insights"
  ON user_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON user_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Training Annotations Policies (join with conversations to check ownership)
CREATE POLICY "Users can view own annotations"
  ON training_annotations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = training_annotations.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own annotations"
  ON training_annotations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = training_annotations.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- =============================================
-- DATABASE FUNCTIONS
-- =============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment session count
CREATE OR REPLACE FUNCTION increment_session_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET
    total_sessions = total_sessions + 1,
    last_active = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEED DATA FOR TESTING (Optional)
-- =============================================
-- Uncomment to create test users with sample data
-- See separate file: supabase-test-data.sql
