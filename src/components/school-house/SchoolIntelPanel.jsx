export default function SchoolIntelPanel({ leaderboardRows, attempts, progressPercent }) {
  return (
    <aside className="school-right-panel glass-panel">
      <section className="mini-widget">
        <h3>Leaderboard</h3>
        <ul>
          {leaderboardRows.map((row) => (
            <li key={row.name}>
              <span>{row.name}</span>
              <strong>{row.score}</strong>
              <em>{row.streak}</em>
            </li>
          ))}
        </ul>
      </section>

      <section className="mini-widget">
        <h3>Recent Attempts</h3>
        <ul className="attempt-list">
          {attempts.map((attempt) => (
            <li key={attempt}>{attempt}</li>
          ))}
        </ul>
      </section>

      <section className="saved-badge flicker">
        <span>Saved progress</span>
        <strong>{progressPercent}%</strong>
      </section>
    </aside>
  )
}
