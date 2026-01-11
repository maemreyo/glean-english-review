'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  LessonHistory,
  LessonHistoryInsert,
  LessonHistoryAnswers
} from '@/lib/supabase/types'
import { toJson } from '@/lib/supabase/types'

/**
 * Saves a completed quiz attempt to the database
 * @param data - Lesson attempt data including lesson_id, lesson_type, score, max_score, and answers
 * @returns The saved lesson history record or null if failed
 */
export async function saveLessonAttempt(data: {
  lesson_id: string
  lesson_type: string
  score: number
  max_score: number
  answers: LessonHistoryAnswers
}): Promise<LessonHistory | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return null
    }

    const insertData: LessonHistoryInsert = {
      user_id: user.id,
      lesson_id: data.lesson_id,
      lesson_type: data.lesson_type,
      score: data.score,
      max_score: data.max_score,
      answers: toJson(data.answers),
    }

    const { data: result, error } = await supabase
      .from('lesson_history')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error saving lesson attempt:', error)
      return null
    }

    return result
  } catch (error) {
    console.error('Unexpected error saving lesson attempt:', error)
    return null
  }
}

/**
 * Retrieves lesson history for the current user
 * @param lessonId - Optional lesson_id filter (e.g., "noun", "verb")
 * @param limit - Maximum number of records to return (default: 50)
 * @returns Array of lesson history records
 */
export async function getUserLessonHistory(
  lessonId?: string,
  limit: number = 50
): Promise<LessonHistory[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return []
    }

    let query = supabase
      .from('lesson_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching lesson history:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching lesson history:', error)
    return []
  }
}

/**
 * Gets aggregate statistics for the current user across all lessons
 * @returns Object containing total attempts, average score, best score, and lesson breakdown
 */
export async function getUserStats(): Promise<{
  totalAttempts: number
  averageScore: number
  bestScore: number
  lessonsCompleted: number
  byLesson: Record<string, {
    attempts: number
    averageScore: number
    bestScore: number
    lastAttempt: string
  }>
} | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return null
    }

    const { data, error } = await supabase
      .from('lesson_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching user stats:', error)
      return null
    }

    if (!data || data.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        lessonsCompleted: 0,
        byLesson: {}
      }
    }

    const totalAttempts = data.length
    const averageScore = data.reduce((sum, record) => {
      const percentage = (record.score / record.max_score) * 100
      return sum + percentage
    }, 0) / totalAttempts

    const bestScore = Math.max(...data.map(record => 
      (record.score / record.max_score) * 100
    ))

    const uniqueLessons = new Set(data.map(record => record.lesson_id))
    const lessonsCompleted = uniqueLessons.size

    // Group by lesson
    const byLesson: Record<string, {
      attempts: number
      averageScore: number
      bestScore: number
      lastAttempt: string
    }> = {}

    data.forEach(record => {
      if (!byLesson[record.lesson_id]) {
        byLesson[record.lesson_id] = {
          attempts: 0,
          averageScore: 0,
          bestScore: 0,
          lastAttempt: record.completed_at
        }
      }
      byLesson[record.lesson_id].attempts++
      byLesson[record.lesson_id].lastAttempt = record.completed_at
    })

    // Calculate averages and best scores per lesson
    Object.keys(byLesson).forEach(lessonId => {
      const lessonRecords = data.filter(r => r.lesson_id === lessonId)
      const totalPercentage = lessonRecords.reduce((sum, record) => {
        return sum + ((record.score / record.max_score) * 100)
      }, 0)
      byLesson[lessonId].averageScore = totalPercentage / lessonRecords.length
      byLesson[lessonId].bestScore = Math.max(...lessonRecords.map(record => 
        (record.score / record.max_score) * 100
      ))
    })

    return {
      totalAttempts,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      lessonsCompleted,
      byLesson
    }
  } catch (error) {
    console.error('Unexpected error fetching user stats:', error)
    return null
  }
}

/**
 * Gets the best attempt for a specific lesson and type
 * @param lessonId - The lesson identifier (e.g., "noun", "verb")
 * @param lessonType - Optional lesson type filter (e.g., "types", "functions")
 * @returns The best lesson history record or null
 */
export async function getBestAttempt(
  lessonId: string,
  lessonType?: string
): Promise<LessonHistory | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return null
    }

    let query = supabase
      .from('lesson_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .order('score', { ascending: false })
      .limit(1)

    if (lessonType) {
      query = query.eq('lesson_type', lessonType)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error('Error fetching best attempt:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching best attempt:', error)
    return null
  }
}

/**
 * Deletes a lesson history record by ID
 * @param historyId - The UUID of the history record to delete
 * @returns True if deletion was successful, false otherwise
 */
export async function deleteLessonHistory(historyId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return false
    }

    const { error } = await supabase
      .from('lesson_history')
      .delete()
      .eq('id', historyId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting lesson history:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error deleting lesson history:', error)
    return false
  }
}
