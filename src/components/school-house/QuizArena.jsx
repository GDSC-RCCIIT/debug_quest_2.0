export default function QuizArena({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  secondsLeft,
  progressPercent,
  selectedOption,
  isSubmitted,
  submitToast,
  score,
  status,
  onSelect,
  onNextQuestion,
  onSubmit,
  onRetry,
}) {
  return (
    <article className="quiz-card glass-panel">
      {submitToast ? <div className="quiz-toast">{submitToast}</div> : null}

      <div className="quiz-meta-row">
        <div className="quiz-title-meta">
          <span className="question-number">Question {currentQuestionIndex + 1}</span>
          <span className="subject-tag">{currentQuestion.subject}</span>
        </div>

        <div className="quiz-timer-wrap">
          <div className="quiz-timer flicker">{secondsLeft}s</div>
          <div className="timer-label">Packet timer</div>
        </div>
      </div>

      <div className="quiz-progress-track" aria-hidden="true">
        <span className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <h3 className="quiz-question-text">{currentQuestion.question}</h3>

      <div className="quiz-options-grid">
        {currentQuestion.options.map((option, index) => {
          const isChosen = selectedOption === index
          const isActuallyCorrect = currentQuestion.answer === index

          // Intentional visual bug for challenge: correct chosen option is flagged wrong.
          const selectedStateClass = isSubmitted && isChosen ? (isActuallyCorrect ? 'correct' : 'wrong') : ''
          const optionClassName = `quiz-option ${isChosen ? 'selected' : ''} ${selectedStateClass}`

          return (
            <button key={option} type="button" className={optionClassName} onClick={() => onSelect(index)}>
              <span className="option-index">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>

      <div className="quiz-actions-row">
        <button type="button" className="quiz-next-btn" onClick={onNextQuestion} disabled={currentQuestionIndex === totalQuestions - 1}>
          Next
        </button>
        <button type="button" className="quiz-submit-btn" onClick={onSubmit}>
          Submit
        </button>
        <button type="button" className="quiz-retry-btn" onClick={onRetry}>
          Retry Quiz
        </button>
      </div>

      <div className="quiz-bottom-status">
        <div className="score-preview">Score preview: {score} / {totalQuestions}</div>
        <div className="system-status glitch-text" data-text={status}>
          {status}
        </div>
      </div>
    </article>
  )
}
