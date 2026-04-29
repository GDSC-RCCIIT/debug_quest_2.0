import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import './SchoolHouse.css'
import LeaderboardPanel from './school-house/LeaderboardPanel'
import PracticeRoomPanel from './school-house/PracticeRoomPanel'
import QuizArena from './school-house/QuizArena'
import SchoolIntelPanel from './school-house/SchoolIntelPanel'
import SchoolSidebar from './school-house/SchoolSidebar'
import SectionPlaceholder from './school-house/SectionPlaceholder'
import StudentRecordsPanel from './school-house/StudentRecordsPanel'
import { attempts, sections } from './school-house/constants'
import useLeaderboardChallenge from './school-house/hooks/useLeaderboardChallenge'
import usePracticeRoomChallenge from './school-house/hooks/usePracticeRoomChallenge'
import useSchoolChallenge from './school-house/hooks/useSchoolChallenge'
import useStudentRecordsChallenge from './school-house/hooks/useStudentRecordsChallenge'

export default function SchoolHouse({ onBack }) {
  const challenge = useSchoolChallenge()
  const records = useStudentRecordsChallenge()
  const leaderboard = useLeaderboardChallenge()
  const practice = usePracticeRoomChallenge()
  const activeSectionLabel = sections.find((section) => section.key === challenge.activeSection)?.label

  return (
    <main className="school-house-shell">
      <div className="school-noise" aria-hidden="true" />
      <div className="school-glow school-glow-cyan" aria-hidden="true" />
      <div className="school-glow school-glow-purple" aria-hidden="true" />

      <div className="school-page-wrap">
        <nav className="school-navbar">
          <button type="button" className="school-back-link" onClick={onBack}>
            ← Back To City
          </button>

          <div className="school-title-group">
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: 0 }}>
              <div style={{ width: '72px', height: '72px', flexShrink: 0 }}>
                <DotLottieReact
                  src="https://lottie.host/24fccafc-b1b4-4b0f-ae18-f1619651f981/F5hfUTrOiv.lottie"
                  loop
                  autoplay
                />
              </div>
              School House
            </h1>
            <p>Knowledge system malfunction detected...</p>
          </div>

          <div className="school-status-pill flicker">ACADEMY NODE: UNSTABLE</div>
        </nav>

        <section className="school-layout-grid">
          <SchoolSidebar sections={sections} activeSection={challenge.activeSection} onSectionChange={challenge.setActiveSection} />

          <section className="school-main-column">
            {challenge.activeSection === 'quiz' ? (
              <QuizArena
                currentQuestion={challenge.currentQuestion}
                currentQuestionIndex={challenge.currentQuestionIndex}
                totalQuestions={challenge.totalQuestions}
                secondsLeft={challenge.secondsLeft}
                progressPercent={challenge.progressPercent}
                selectedOption={challenge.selectedOption}
                isSubmitted={challenge.isSubmitted}
                submitToast={challenge.submitToast}
                score={challenge.score}
                status={challenge.status}
                onSelect={challenge.handleSelect}
                onNextQuestion={challenge.handleNextQuestion}
                onSubmit={challenge.handleSubmit}
                onRetry={challenge.handleRetryQuiz}
              />
            ) : challenge.activeSection === 'records' ? (
              <StudentRecordsPanel records={records} onSearchChange={records.onSearchChange} onClassChange={records.onClassChange} onPageChange={records.setPage} />
            ) : challenge.activeSection === 'leaderboard' ? (
              <LeaderboardPanel rows={leaderboard.rankedRows} />
            ) : challenge.activeSection === 'practice' ? (
              <PracticeRoomPanel practice={practice} />
            ) : (
              <SectionPlaceholder title={activeSectionLabel} />
            )}
          </section>

          <SchoolIntelPanel
            leaderboardRows={leaderboard.rankedRows}
            attempts={attempts}
            progressPercent={challenge.progressPercent}
            totalQuestions={challenge.totalQuestions}
          />
        </section>
      </div>
    </main>
  )
}
