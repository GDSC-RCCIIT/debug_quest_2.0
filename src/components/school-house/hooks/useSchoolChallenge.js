import { useEffect, useMemo, useState } from 'react'
import { QUESTION_TIME_SECONDS, quizQuestions } from '../constants'

const STORAGE_KEY = 'debug-quest-school-progress'
const TAB_SYNC_KEY = 'debug-quest-school-tab-sync'

function loadPersistedState() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY)
  if (!rawState) return null

  try {
    return JSON.parse(rawState)
  } catch {
    return null
  }
}

export default function useSchoolChallenge() {
  const persisted = loadPersistedState()

  const [activeSection, setActiveSection] = useState(
    typeof persisted?.activeSection === 'string' ? persisted.activeSection : 'quiz'
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const raw = persisted?.currentQuestionIndex
    if (typeof raw !== 'number') return 0
    return Math.max(0, Math.min(quizQuestions.length - 1, raw))
  })
  const [answers, setAnswers] = useState(
    persisted?.answers && typeof persisted.answers === 'object' ? persisted.answers : {}
  )
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_SECONDS)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitArmed, setSubmitArmed] = useState(false)
  const [submitToast, setSubmitToast] = useState('')
  const [status, setStatus] = useState('System ready. Solve instability in Quiz Arena.')

  const currentQuestion = quizQuestions[currentQuestionIndex]

  useEffect(() => {
    const snapshot = {
      answers,
      currentQuestionIndex,
      activeSection,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }, [activeSection, answers, currentQuestionIndex])

  useEffect(() => {
    const syncPayload = {
      answers,
      currentQuestionIndex,
      at: Date.now(),
    }
    window.localStorage.setItem(TAB_SYNC_KEY, JSON.stringify(syncPayload))
  }, [answers, currentQuestionIndex])

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== TAB_SYNC_KEY || !event.newValue) return

      try {
        const payload = JSON.parse(event.newValue)
        if (payload.answers && typeof payload.answers === 'object') {
          setAnswers(payload.answers)
        }
        if (typeof payload.currentQuestionIndex === 'number') {
          setCurrentQuestionIndex(Math.max(0, Math.min(quizQuestions.length - 1, payload.currentQuestionIndex)))
        }
        setStatus('Remote tab state synced over local attempt.')
      } catch {
        // Silent by design.
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    setSecondsLeft(QUESTION_TIME_SECONDS)
  }, [currentQuestionIndex])

  useEffect(() => {
    if (activeSection !== 'quiz' || isSubmitted || secondsLeft === 0) return undefined

    const timerId = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex((index) => index + 1)
            setIsSubmitted(false)
            setSubmitArmed(false)
            setStatus('Timer glitch detected. Jumping to next prompt...')
            return QUESTION_TIME_SECONDS
          }

          setStatus('Final timer depleted. Submit to lock your result.')
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [activeSection, currentQuestionIndex, isSubmitted, secondsLeft])

  useEffect(() => {
    if (!submitToast) return undefined
    const timerId = window.setTimeout(() => setSubmitToast(''), 1700)
    return () => window.clearTimeout(timerId)
  }, [submitToast])

  const score = useMemo(() => {
    return quizQuestions.reduce((total, question, index) => {
      return answers[index] === question.answer ? total + 1 : total
    }, 0)
  }, [answers])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  const progressPercent = useMemo(() => {
    return Math.round(((currentQuestionIndex + 1) / (quizQuestions.length + 1)) * 100)
  }, [currentQuestionIndex])

  function handleSelect(optionIndex) {
    if (isSubmitted) return

    setAnswers((previous) => ({
      ...previous,
      [currentQuestionIndex]: optionIndex,
    }))
    setStatus('Answer locked in local memory buffer.')
  }

  function handleNextQuestion() {
    if (currentQuestionIndex >= quizQuestions.length - 1) return

    setIsSubmitted(false)
    setSubmitArmed(false)

    // Intentional off-by-one bug on first transition.
    const jumpSize = currentQuestionIndex === 0 ? 2 : 1
    setCurrentQuestionIndex((index) => Math.min(quizQuestions.length - 1, index + jumpSize))
    setStatus('Question stream synchronized.')
  }

  function handleSubmit() {
    if (isSubmitted) return

    setSubmitArmed(true)
    setIsSubmitted(true)
    setSubmitToast('Attempt saved successfully')

    fetch('/api/quiz/save-marks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers, score }),
      keepalive: true,
    }).catch(() => {
      // Silent by design; success toast is still shown.
    })

    const finalScore = quizQuestions.reduce((total, question, index) => {
      return answers[index] === question.answer ? total + 1 : total
    }, 0)

    if (finalScore >= 4) {
      setStatus('Rank upgraded. Academy firewall acknowledges your precision.')
      return
    }

    if (finalScore >= 2) {
      setStatus('Partial stabilization achieved. Continue in Practice Room for full recovery.')
      return
    }

    setStatus('Knowledge core remains unstable. Retry required.')
  }

  function handleRetryQuiz() {
    setIsSubmitted(false)
    setSubmitArmed(false)
    setCurrentQuestionIndex(0)
    setSecondsLeft(QUESTION_TIME_SECONDS)
    setStatus('Fresh attempt initialized. Trace integrity uncertain.')
  }

  return {
    activeSection,
    setActiveSection,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: quizQuestions.length,
    selectedOption: answers[currentQuestionIndex],
    score,
    answeredCount,
    secondsLeft,
    progressPercent,
    isSubmitted,
    submitToast,
    status,
    handleSelect,
    handleNextQuestion,
    handleSubmit,
    handleRetryQuiz,
  }
}