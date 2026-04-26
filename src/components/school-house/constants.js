export const sections = [
  { key: 'quiz', label: 'Quiz Arena' },
  { key: 'records', label: 'Student Records' },
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'practice', label: 'Practice Room' },
]

export const quizQuestions = [ 
  {
    subject: 'Algorithms',
    question: 'A scoreboard update is firing twice after each match. Which bug class is most likely?',
    options: ['Race condition', 'Memory leak', 'Syntax error', 'Network timeout'],
    answer: 0,
  },
  {
    subject: 'Frontend',
    question: 'A form loses typed values when switching tabs. Which strategy is safest to preserve state?',
    options: ['Store fields in component state', 'Use a full page reload', 'Disable tab switching', 'Only use global CSS'],
    answer: 0,
  },
  {
    subject: 'Databases',
    question: 'Two users edit the same profile and one change disappears. What protects against this?',
    options: ['Optimistic concurrency control', 'Minification', 'Tree shaking', 'Image compression'],
    answer: 0,
  },
  {
    subject: 'Debugging',
    question: 'A bug appears only in production. What is the strongest first step?',
    options: ['Collect logs and reproduce with prod-like data', 'Rewrite the module immediately', 'Disable error handling', 'Delete recent tests'],
    answer: 0,
  },
  {
    subject: 'Security',
    question: 'User input is rendered as HTML in chat. Which fix blocks injected scripts?',
    options: ['Sanitize and escape input output', 'Increase font size', 'Add caching headers', 'Bundle fewer files'],
    answer: 0,
  },
]

export const leaderboardRows = [
  { name: 'Nova-17', score: 4800, streak: '12x' },
  { name: 'ByteRaven', score: 4510, streak: '9x' },
  { name: 'PatchKid', score: 4510, streak: '8x' },
]

export const attempts = [
  'Protocol Logic - 72% - 2m ago',
  'Render Systems - 89% - 11m ago',
  'Memory Maze - 61% - 29m ago',
]

export const QUESTION_TIME_SECONDS = 30
