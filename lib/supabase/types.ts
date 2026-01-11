export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Lesson History Answer Type (stored in answers JSONB column)
export interface LessonHistoryAnswer {
  question: string
  userChoice: string
  correctChoice: string
  isCorrect: boolean
  explain: string
}

export type LessonHistoryAnswers = LessonHistoryAnswer[]

export interface Database {
  public: {
    Tables: {
      lesson_history: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          lesson_type: string
          score: number
          max_score: number
          completed_at: string
          answers: LessonHistoryAnswers
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          lesson_type: string
          score: number
          max_score: number
          completed_at?: string
          answers?: LessonHistoryAnswers
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          lesson_type?: string
          score?: number
          max_score?: number
          completed_at?: string
          answers?: LessonHistoryAnswers
          created_at?: string
        }
      }
    }
  }
}

// Supabase-generated types (will be updated after migration)
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Lesson History types
export type LessonHistory = Tables<'lesson_history'>
export type LessonHistoryInsert = TablesInsert<'lesson_history'>
export type LessonHistoryUpdate = TablesUpdate<'lesson_history'>
