import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { getBestAttemptAction } from '@/app/lessons/actions'
import LessonQuiz from '@/components/LessonQuiz'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'lessons.nounMaster' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function NounLessonPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'lessons.nounMaster' })

  // Get user's best score for this lesson
  let previousBestScore: number | undefined = undefined
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Get best score from either mode (types or functions)
      const typesResult = await getBestAttemptAction('noun', 'types')
      const functionsResult = await getBestAttemptAction('noun', 'functions')
      
      const bestScores: number[] = []
      
      if (typesResult.success && typesResult.data) {
        const percentage = (typesResult.data.score / typesResult.data.max_score) * 100
        bestScores.push(percentage)
      }
      
      if (functionsResult.success && functionsResult.data) {
        const percentage = (functionsResult.data.score / functionsResult.data.max_score) * 100
        bestScores.push(percentage)
      }
      
      if (bestScores.length > 0) {
        previousBestScore = Math.max(...bestScores)
      }
    }
  } catch (error) {
    console.error('Error fetching best score:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-200">
      <LessonQuiz 
        lessonId="noun"
        previousBestScore={previousBestScore}
      />
    </div>
  )
}
