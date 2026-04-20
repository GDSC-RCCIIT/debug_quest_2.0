import './Sidebar.css'

const steps = [
  {
    icon: '📍',
    iconColor: '#e84040',
    num: '1.',
    title: 'EXPLORE THE CITY',
    desc: 'Click buildings to enter',
  },
  {
    icon: '🔍',
    iconColor: '#e84040',
    num: '2.',
    title: 'FIND & FIX BUGS',
    desc: 'Read issues • Debug code',
  },
  {
    icon: '✅',
    iconColor: '#4caf50',
    num: '3.',
    title: 'SUBMIT PR',
    desc: 'Create fixes via GitHub',
  },
]

const districts = [
  { name: 'SHOP', icon: '🔒', color: '#e84040', bg: '#8b1a1a', dots: [true, true, false], label: 'Easy' },
  { name: 'BANK', icon: '🏦', color: '#4a90d9', bg: '#1a3a6a', dots: [true, true, true], label: 'Medium' },
  { name: 'SCHOOL', icon: '📖', color: '#e87820', bg: '#5a3a00', dots: [true, true, true], label: 'Medium' },
  { name: 'ARCADE', icon: '🎮', color: '#9b59b6', bg: '#3a1050', dots: [true, true, false], label: 'Hard' },
]

export default function Sidebar({ bugsFixed, totalBugs }) {
  const pct = (bugsFixed / totalBugs) * 100

  return (
    <div className="sidebar">
      <div className="panel how-it-works">
        <div className="panel-header">
          <span className="panel-diamond">◆</span>
          <span className="panel-title">HOW IT WORKS</span>
        </div>
        <div className="steps-list">
          {steps.map((step, i) => (
            <div key={i} className="step-row">
              <div className="step-icon" style={{ fontSize: 20, color: step.iconColor }}>{step.icon}</div>
              <div className="step-text">
                <span className="step-num">{step.num}</span>
                <span className="step-title">{step.title}</span>
                <span className="step-desc">{step.desc}</span>
              </div>
            </div>
          ))}
          <div className="step-row restore-row">
            <div className="step-icon star-icon">★</div>
            <div className="step-text">
              <span className="step-title gold">RESTORE THE CITY!</span>
              <span className="step-desc">Unlock areas as you fix</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="panel districts-panel">
        <div className="districts-header">
          <span className="districts-label">4 DISTRICTS</span>
          <span className="districts-sep">•</span>
          <span className="districts-label">50+ BUGS</span>
        </div>
        <div className="districts-list">
          {districts.map((d, i) => (
            <div key={i} className="district-row" style={{ '--accent': d.color }}>
              <div className="district-icon-wrap" style={{ background: d.bg, borderColor: d.color }}>
                <span>{d.icon}</span>
              </div>
              <span className="district-name" style={{ color: d.color }}>{d.name}</span>
              <div className="district-dots">
                {d.dots.map((filled, j) => (
                  <div key={j} className={`dot ${filled ? 'filled' : 'empty'}`} style={{ background: filled ? d.color : 'transparent', borderColor: d.color }} />
                ))}
              </div>
              <span className="district-diff">{d.label}</span>
            </div>
          ))}
        </div>
      </div>



      <div className="corner-dots">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="corner-dot" />
        ))}
      </div>
    </div>
  )
}
