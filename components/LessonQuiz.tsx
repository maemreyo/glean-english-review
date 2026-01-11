'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
// @ts-ignore - canvas-confetti doesn't have types
import confetti from 'canvas-confetti'
import { saveLessonAttemptAction } from '@/app/lessons/actions'
import type { LessonHistoryAnswers, LessonHistoryAnswer } from '@/lib/supabase/types'
import { dataTypes, dataFunctions, typeOptions, type NounTypeQuestion, type NounFunctionQuestion } from '@/lib/data/noun-quiz'

type GameMode = 'types' | 'functions'
type Screen = 'menu' | 'game' | 'result'

interface UserHistory {
  question: string
  userChoice: string
  correctChoice: string
  isCorrect: boolean
  explain: string
}

type QuestionData = NounTypeQuestion | NounFunctionQuestion

interface LessonQuizProps {
  lessonId: string
  previousBestScore?: number
}

const SOUND_CORRECT = 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'
const SOUND_WRONG = 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
const SOUND_WIN = 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'

export default function LessonQuiz({ lessonId, previousBestScore }: LessonQuizProps) {
  const t = useTranslations('lessons.nounMaster')
  
  const [screen, setScreen] = useState<Screen>('menu')
  const [currentMode, setCurrentMode] = useState<GameMode>('types')
  const [currentQuestions, setCurrentQuestions] = useState<QuestionData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isAnswering, setIsAnswering] = useState(false)
  const [userHistory, setUserHistory] = useState<UserHistory[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackExplanation, setFeedbackExplanation] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Track failed audio URLs to prevent repeated attempts
  const failedAudioRef = useRef<Set<string>>(new Set())
  // Store active audio elements for cleanup
  const activeAudioRefs = useRef<HTMLAudioElement[]>([])

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Play sound helper with graceful error handling
  const playSound = useCallback((type: 'correct' | 'wrong' | 'win') => {
    const src = type === 'correct' ? SOUND_CORRECT : type === 'wrong' ? SOUND_WRONG : SOUND_WIN
    
    // Skip if this audio source has previously failed
    if (failedAudioRef.current.has(src)) {
      return // Silent mode - don't attempt to load failed audio again
    }
    
    const audio = new Audio(src)
    audio.currentTime = 0
    
    // Handle audio loading errors
    audio.addEventListener('error', () => {
      failedAudioRef.current.add(src)
      // Remove from active refs
      const index = activeAudioRefs.current.indexOf(audio)
      if (index > -1) {
        activeAudioRefs.current.splice(index, 1)
      }
    })
    
    // Store reference for cleanup
    activeAudioRefs.current.push(audio)
    
    // Attempt to play, fail silently if it doesn't work
    audio.play().catch(() => {
      // Play failed - could be due to autoplay policy, rapid unmount, etc.
      // Don't add to failedAudioRef here as it might be a transient issue
    })
  }, [])

  // Cleanup function to stop all active audio when component unmounts
  const cleanupAudio = useCallback(() => {
    activeAudioRefs.current.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    activeAudioRefs.current = []
  }, [])

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [cleanupAudio])

  // Start game
  const startGame = (mode: GameMode) => {
    setCurrentMode(mode)
    setScore(0)
    setCurrentIndex(0)
    setUserHistory([])
    setShowFeedback(false)
    
    const sourceData: QuestionData[] = mode === 'types' ? [...dataTypes] : [...dataFunctions]
    setCurrentQuestions(shuffleArray(sourceData))
    setScreen('game')
    setIsAnswering(true)
  }

  // Get answer options based on mode
  const getOptions = (qData: QuestionData): string[] => {
    if (currentMode === 'types') {
      return typeOptions as string[]
    }
    return (qData as NounFunctionQuestion).options
  }

  // Get correct answer based on mode
  const getCorrectAnswer = (qData: QuestionData): string => {
    if (currentMode === 'types') {
      return (qData as NounTypeQuestion).type
    }
    return (qData as NounFunctionQuestion).ans
  }

  // Check answer
  const checkAnswer = (selected: string, qData: QuestionData) => {
    if (!isAnswering) return
    setIsAnswering(false)

    const correctAnswer = getCorrectAnswer(qData)
    const isCorrect = selected === correctAnswer

    // Save to history
    setUserHistory(prev => [...prev, {
      question: qData.q,
      userChoice: selected,
      correctChoice: correctAnswer,
      isCorrect,
      explain: qData.explain
    }])

    if (isCorrect) {
      playSound('correct')
      setScore(prev => prev + 10)
      
      setTimeout(() => {
        if (currentIndex + 1 >= currentQuestions.length) {
          endGame()
        } else {
          setCurrentIndex(prev => prev + 1)
          setIsAnswering(true)
        }
      }, 800)
    } else {
      playSound('wrong')
      setFeedbackExplanation(qData.explain)
      setShowFeedback(true)
    }
  }

  // Continue to next question after wrong answer
  const continueToNext = () => {
    setShowFeedback(false)
    if (currentIndex + 1 >= currentQuestions.length) {
      endGame()
    } else {
      setCurrentIndex(prev => prev + 1)
      setIsAnswering(true)
    }
  }

  // End game and save results
  const endGame = async () => {
    playSound('win')
    setScreen('result')

    // Trigger confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }
    
    const random = (min: number, max: number) => Math.random() * (max - min) + min
    
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }))
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }))
    }, 250)

    // Save to database
    setIsSaving(true)
    const maxScore = currentQuestions.length * 10
    const answers: LessonHistoryAnswers = userHistory.map((h): LessonHistoryAnswer => ({
      question: h.question,
      userChoice: h.userChoice,
      correctChoice: h.correctChoice,
      isCorrect: h.isCorrect,
      explain: h.explain
    }))

    await saveLessonAttemptAction({
      lesson_id: lessonId,
      lesson_type: currentMode,
      score,
      max_score: maxScore,
      answers
    })
    setIsSaving(false)
  }

  // Reset to menu
  const playAgain = () => {
    setScreen('menu')
    setScore(0)
    setCurrentIndex(0)
    setUserHistory([])
    setShowFeedback(false)
  }

  const currentQData = currentQuestions[currentIndex]
  const progressPercent = currentQuestions.length > 0 ? (currentIndex / currentQuestions.length) * 100 : 0

  return (
    <div className="bg-white/95 backdrop-blur-sm w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border-4 border-white flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="bg-indigo-600 p-4 md:p-6 text-center relative shrink-0">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide uppercase drop-shadow-md">
          <span className="mr-2">🎓</span> {t('title')}
        </h1>
        <p className="text-indigo-200 mt-1 text-sm">{t('subtitle')}</p>
        {screen === 'game' && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white text-indigo-700 px-3 py-1 rounded-full font-bold shadow-lg text-sm md:text-base">
            {t('score')}: <span>{score}</span>
          </div>
        )}
      </div>

      {/* MENU SCREEN */}
      {screen === 'menu' && (
        <div className="p-8 text-center space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{t('selectMode')}</h2>
            <p className="text-gray-500">{t('welcome')}</p>
          </div>

          {previousBestScore !== undefined && previousBestScore > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 font-bold">
                🏆 {t('previousBest')}: {previousBestScore.toFixed(0)}%
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => startGame('types')}
              className="group p-6 bg-blue-100 hover:bg-blue-500 rounded-xl transition-all duration-300 border-2 border-blue-200 cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📦</div>
              <h3 className="font-bold text-blue-800 group-hover:text-white text-lg">{t('typesMode.title')}</h3>
              <p className="text-blue-600 group-hover:text-blue-100 text-sm mt-2">{t('typesMode.description')}</p>
            </button>

            <button
              onClick={() => startGame('functions')}
              className="group p-6 bg-purple-100 hover:bg-purple-500 rounded-xl transition-all duration-300 border-2 border-purple-200 cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="font-bold text-purple-800 group-hover:text-white text-lg">{t('functionsMode.title')}</h3>
              <p className="text-purple-600 group-hover:text-purple-100 text-sm mt-2">{t('functionsMode.description')}</p>
            </button>
          </div>
        </div>
      )}

      {/* GAME SCREEN */}
      {screen === 'game' && currentQData && (
        <div className="p-4 md:p-8 overflow-y-auto">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Area */}
          <div className="text-center mb-6 md:mb-8">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              {t('question')} {currentIndex + 1}/{currentQuestions.length}
            </span>
            
            <div
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 min-h-[60px] md:min-h-[80px] flex items-center justify-center px-4 leading-tight"
              dangerouslySetInnerHTML={{ __html: currentQData.q }}
            />
            <p className="text-gray-500 text-sm italic min-h-[1.5rem]">
              {t('hint')}: {currentQData.hint}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {getOptions(currentQData).map((option) => {
              const historyItem = userHistory[currentIndex]
              const isSelected = historyItem?.userChoice === option
              const isCorrectOption = historyItem?.correctChoice === option
              const isDisabled = historyItem !== undefined
              
              let buttonClass = "p-3 md:p-4 bg-white border-2 border-indigo-100 rounded-xl text-indigo-700 font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm active:scale-95 text-base md:text-lg flex items-center justify-center"
              
              if (isDisabled) {
                if (isSelected && historyItem?.isCorrect) {
                  buttonClass = "p-3 md:p-4 bg-green-500 border-2 border-green-600 rounded-xl text-white font-bold text-base md:text-lg flex items-center justify-center"
                } else if (isSelected && !historyItem?.isCorrect) {
                  buttonClass = "p-3 md:p-4 bg-red-500 border-2 border-red-600 rounded-xl text-white font-bold text-base md:text-lg flex items-center justify-center"
                } else if (isCorrectOption) {
                  buttonClass = "p-3 md:p-4 bg-green-100 border-2 border-green-500 rounded-xl text-green-800 font-bold text-base md:text-lg flex items-center justify-center"
                } else {
                  buttonClass = "p-3 md:p-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-400 font-bold text-base md:text-lg flex items-center justify-center cursor-not-allowed"
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => checkAnswer(option, currentQData)}
                  disabled={isDisabled}
                  className={buttonClass}
                >
                  {option}
                  {isDisabled && isCorrectOption && !isSelected && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation Modal */}
          {showFeedback && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-left animate-fade-in">
              <h4 className="font-bold text-red-600 flex items-center">
                <span className="mr-2">⚠️</span> {t('incorrect')}
              </h4>
              <p className="text-gray-700 mt-1 text-sm">{feedbackExplanation}</p>
              <button
                onClick={continueToNext}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 w-full transition-colors"
              >
                {t('continue')} <span className="ml-1">→</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULT SCREEN */}
      {screen === 'result' && (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-6 text-center shrink-0">
            <div className="text-5xl mb-2 animate-bounce-short">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800">{t('completed')}</h2>
            
            <div className="bg-indigo-50 rounded-xl p-4 mt-4 inline-block min-w-[200px]">
              <div className="text-xs text-indigo-500 uppercase font-bold tracking-wider">{t('totalScore')}</div>
              <div className="text-4xl font-black text-indigo-600 my-1">
                <span>{score}</span><span className="text-xl text-indigo-300">/{currentQuestions.length * 10}</span>
              </div>
            </div>
            {isSaving && (
              <p className="text-sm text-gray-500 mt-2">{t('saving')}</p>
            )}
          </div>

          {/* Review Section */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 bg-gray-50 border-t">
            <h3 className="text-lg font-bold text-gray-700 my-4 sticky top-0 bg-gray-50 py-2 border-b">
              <span className="mr-2">📋</span>{t('review.title')}
            </h3>
            <div className="space-y-3">
              {userHistory.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg text-left ${item.isCorrect ? 'border-l-4 border-green-500 bg-green-50' : 'border-l-4 border-red-500 bg-red-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {item.isCorrect ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <span className="text-red-500 text-xl">✗</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-sm md:text-base mb-1">
                        {t('review.question')} {index + 1}: <span dangerouslySetInnerHTML={{ __html: item.question }} />
                      </div>
                      {item.isCorrect ? (
                        <p className="text-sm text-green-700">
                          {t('review.correct')}: <b>{item.userChoice}</b>
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-red-700 mb-1">
                            {t('review.wrong')}: <s className="line-through decoration-red-500">{item.userChoice}</s>
                          </p>
                          <p className="text-sm text-green-700 font-bold">
                            {t('review.correctAnswer')}: {item.correctChoice}
                          </p>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-2 bg-white/50 p-2 rounded border border-gray-200">
                        <span className="text-yellow-500 mr-1">💡</span> {item.explain}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-white border-t shrink-0 text-center shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
            <button
              onClick={playAgain}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-1 w-full md:w-auto"
            >
              <span className="mr-2">🔄</span> {t('playAgain')}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 p-2 text-center text-[10px] text-gray-400 border-t shrink-0">
        Teacher Tools for Classroom Interaction
      </div>
    </div>
  )
}
