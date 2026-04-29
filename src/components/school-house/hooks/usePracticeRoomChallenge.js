import { useEffect, useMemo, useState } from 'react'
import { practiceCategories, practiceDifficulties, practiceQuestions } from '../practiceData'

const PRACTICE_TIME_SECONDS = 90

export default function usePracticeRoomChallenge() {
  const [activeCategory, setActiveCategory] = useState(practiceCategories[0])
  const [questionCategory, setQuestionCategory] = useState(practiceCategories[0])
  const [difficulty, setDifficulty] = useState(practiceDifficulties[1])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(PRACTICE_TIME_SECONDS)
  const [pausedDisplayTime, setPausedDisplayTime] = useState(PRACTICE_TIME_SECONDS)

  const questionSet = useMemo(() => practiceQuestions[questionCategory][difficulty], [questionCategory, difficulty])
  const currentQuestion = questionSet[currentIndex] ?? questionSet[0]

  useEffect(() => {
    if (!isRunning || isPaused) return undefined

    const timerId = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timerId)
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isRunning, isPaused])

  const displayedSeconds = isPaused ? pausedDisplayTime : secondsLeft

  function handleCategoryChange(nextCategory) {
    setActiveCategory(nextCategory)
    // Intentional stale-state bug: question source trails previous tab.
    setQuestionCategory(nextCategory)
    setCurrentIndex(0)
    setSelectedAnswers({})
    setScore(0)
  }

  function handleDifficultyChange(nextDifficulty) {
    setDifficulty(nextDifficulty)
    setCurrentIndex(0)
    setSelectedAnswers({})
    setScore(0)
  }

  function handleSelectAnswer(optionIndex) {
    if (!currentQuestion) return

    const key = currentQuestion.id
    const isCorrect = optionIndex === currentQuestion.answer

    setSelectedAnswers((previous) => ({
      ...previous,
      [key]: optionIndex,
    }))

    setScore((previous) => {
      const prior = selectedAnswers[key]
      const wasCorrect = prior === currentQuestion.answer
      if (isCorrect && !wasCorrect) return previous + 1
      if (!isCorrect && wasCorrect) return Math.max(0, previous - 1)
      return previous
    })
  }

  function handleStart() {
    setIsRunning(true)
    setIsPaused(false)
    setPausedDisplayTime(secondsLeft)
  }

  function handlePause() {
    setIsPaused(true)
    setPausedDisplayTime(secondsLeft)
  }

  function handleResume() {
    setIsPaused(false)
  }

  function handleNextQuestion() {
    setCurrentIndex((previous) => (previous >= questionSet.length - 1 ? 0 : previous + 1))
  }

  return {
    categories: practiceCategories,
    difficulties: practiceDifficulties,
    activeCategory,
    difficulty,
    currentQuestion,
    currentIndex,
    selectedAnswers,
    score,
    isRunning,
    isPaused,
    displayedSeconds,
    progressLabel: `${currentIndex + 1}/${questionSet.length}`,
    handleCategoryChange,
    handleDifficultyChange,
    handleSelectAnswer,
    handleStart,
    handlePause,
    handleResume,
    handleNextQuestion,
  }
}
