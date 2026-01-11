-- Create lesson_history table for tracking quiz attempts
CREATE TABLE IF NOT EXISTS public.lesson_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    lesson_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    answers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS lesson_history_user_id_idx ON public.lesson_history(user_id);
CREATE INDEX IF NOT EXISTS lesson_history_lesson_id_idx ON public.lesson_history(lesson_id);
CREATE INDEX IF NOT EXISTS lesson_history_completed_at_idx ON public.lesson_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS lesson_history_user_lesson_idx ON public.lesson_history(user_id, lesson_id);

-- Enable Row Level Security
ALTER TABLE public.lesson_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read their own history
CREATE POLICY "Users can view own lesson history"
    ON public.lesson_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policies: Users can insert their own lesson history
CREATE POLICY "Users can insert own lesson history"
    ON public.lesson_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies: Users can update their own lesson history (if needed)
CREATE POLICY "Users can update own lesson history"
    ON public.lesson_history
    FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies: Users can delete their own lesson history
CREATE POLICY "Users can delete own lesson history"
    ON public.lesson_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE public.lesson_history IS 'Stores quiz attempt history for users completing lessons';
COMMENT ON COLUMN public.lesson_history.answers IS 'JSONB array storing detailed answer history: {question, userChoice, correctChoice, isCorrect, explain}';
COMMENT ON COLUMN public.lesson_history.lesson_id IS 'Lesson identifier (e.g., "noun", "verb", "adjective")';
COMMENT ON COLUMN public.lesson_history.lesson_type IS 'Quiz mode/type (e.g., "types", "functions")';
