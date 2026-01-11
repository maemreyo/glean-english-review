'use server'

import { revalidatePath } from 'next/cache'
import {
  saveLessonAttempt as saveLessonAttemptDb,
  getUserLessonHistory as getUserLessonHistoryDb,
  getUserStats as getUserStatsDb,
  getBestAttempt as getBestAttemptDb,
  deleteLessonHistory as deleteLessonHistoryDb
} from '@/lib/db/lesson-history'
import type { LessonHistoryAnswers } from '@/lib/supabase/types'

/**
 * Server Action: Save lesson completion history
 * Validates form data and saves to database
 * @param formData - Form data containing lesson_id, lesson_type, score, max_score, and answers
 * @returns JSON response with success status and data
 */
export async function saveLessonHistoryAction(formData: FormData) {
  try {
    const lesson_id = formData.get('lesson_id') as string
    const lesson_type = formData.get('lesson_type') as string
    const score = parseInt(formData.get('score') as string)
    const max_score = parseInt(formData.get('max_score') as string)
    const answersJson = formData.get('answers') as string

    // Validation
    if (!lesson_id || !lesson_type || isNaN(score) || isNaN(max_score)) {
      return {
        success: false,
        error: 'Missing required fields: lesson_id, lesson_type, score, max_score'
      }
    }

    if (!answersJson) {
      return {
        success: false,
        error: 'Missing answers data'
      }
    }

    let answers: LessonHistoryAnswers
    try {
      answers = JSON.parse(answersJson) as LessonHistoryAnswers
    } catch (error) {
      return {
        success: false,
        error: 'Invalid answers JSON format'
      }
    }

    // Validate answers array
    if (!Array.isArray(answers)) {
      return {
        success: false,
        error: 'Answers must be an array'
      }
    }

    // Save to database
    const result = await saveLessonAttemptDb({
      lesson_id,
      lesson_type,
      score,
      max_score,
      answers
    })

    if (!result) {
      return {
        success: false,
        error: 'Failed to save lesson history'
      }
    }

    // Revalidate paths that might display lesson history
    revalidatePath('/lessons')
    revalidatePath('/dashboard')
    revalidatePath(`/lessons/${lesson_id}`)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error in saveLessonHistoryAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server Action: Get lesson history for current user
 * @param lessonId - Optional lesson_id filter
 * @returns JSON response with success status and history data
 */
export async function getLessonHistoryAction(lessonId?: string) {
  try {
    const history = await getUserLessonHistoryDb(lessonId, 50)

    return {
      success: true,
      data: history
    }
  } catch (error) {
    console.error('Error in getLessonHistoryAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    }
  }
}

/**
 * Server Action: Get user statistics
 * @returns JSON response with success status and stats data
 */
export async function getUserStatsAction() {
  try {
    const stats = await getUserStatsDb()

    if (!stats) {
      return {
        success: false,
        error: 'Failed to fetch user stats'
      }
    }

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    console.error('Error in getUserStatsAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server Action: Get best attempt for a specific lesson
 * @param lessonId - The lesson identifier
 * @param lessonType - Optional lesson type filter
 * @returns JSON response with success status and best attempt data
 */
export async function getBestAttemptAction(lessonId: string, lessonType?: string) {
  try {
    if (!lessonId) {
      return {
        success: false,
        error: 'Missing lesson_id parameter'
      }
    }

    const bestAttempt = await getBestAttemptDb(lessonId, lessonType)

    return {
      success: true,
      data: bestAttempt
    }
  } catch (error) {
    console.error('Error in getBestAttemptAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server Action: Delete a lesson history record
 * @param historyId - The UUID of the history record to delete
 * @returns JSON response with success status
 */
export async function deleteLessonHistoryAction(historyId: string) {
  try {
    if (!historyId) {
      return {
        success: false,
        error: 'Missing history_id parameter'
      }
    }

    const success = await deleteLessonHistoryDb(historyId)

    if (!success) {
      return {
        success: false,
        error: 'Failed to delete lesson history'
      }
    }

    // Revalidate paths that might display lesson history
    revalidatePath('/lessons')
    revalidatePath('/dashboard')

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in deleteLessonHistoryAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server Action: Save lesson attempt from direct object data
 * This is useful when called from client components with JSON data
 * @param data - Lesson attempt data object
 * @returns JSON response with success status and data
 */
export async function saveLessonAttemptAction(data: {
  lesson_id: string
  lesson_type: string
  score: number
  max_score: number
  answers: LessonHistoryAnswers
}) {
  try {
    // Validation
    if (!data.lesson_id || !data.lesson_type || typeof data.score !== 'number' || typeof data.max_score !== 'number') {
      return {
        success: false,
        error: 'Missing or invalid required fields'
      }
    }

    if (!Array.isArray(data.answers)) {
      return {
        success: false,
        error: 'Answers must be an array'
      }
    }

    // Save to database
    const result = await saveLessonAttemptDb(data)

    if (!result) {
      return {
        success: false,
        error: 'Failed to save lesson attempt'
      }
    }

    // Revalidate paths
    revalidatePath('/lessons')
    revalidatePath('/dashboard')
    revalidatePath(`/lessons/${data.lesson_id}`)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error in saveLessonAttemptAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
