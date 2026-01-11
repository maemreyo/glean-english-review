import type { Database, Json } from './generated-types'

// Re-export the generated Database type
export type { Database } from './generated-types'
export type { Json } from './generated-types'

// Lesson History Answer Type (stored in answers JSONB column)
// Use index signature to satisfy Json type compatibility
export interface LessonHistoryAnswer {
  question: string
  userChoice: string
  correctChoice: string
  isCorrect: boolean
  explain: string
  [key: string]: Json | undefined  // Index signature for Json compatibility
}

export type LessonHistoryAnswers = LessonHistoryAnswer[]

// Type assertion helper for LessonHistoryAnswers to Json
export function toJson(answers: LessonHistoryAnswers): Json {
  return answers as Json
}

// Type guard/helper to cast Json to LessonHistoryAnswers
export function toLessonHistoryAnswers(data: Json | null): LessonHistoryAnswers {
  if (!data || !Array.isArray(data)) return []
  return data as LessonHistoryAnswers
}

// Convenience type helpers for Supabase tables
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Lesson History types
export type LessonHistory = Tables<'lesson_history'>
export type LessonHistoryInsert = TablesInsert<'lesson_history'>
export type LessonHistoryUpdate = TablesUpdate<'lesson_history'>
