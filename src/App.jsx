import React, { useState, useCallback } from 'react'
import './index.css'

// ---------- cute sound effects (oscillator beeps) ----------
function playBeep(freq, duration, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

function playCorrect() { playBeep(880, 0.18); setTimeout(() => playBeep(1100, 0.2), 120) }
function playWrong() { playBeep(220, 0.3, 'sawtooth') }
function playClick() { playBeep(660, 0.05) }
function playCelebrate() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playBeep(f, 0.2), i * 100)) }

// ---------- confetti ----------
function launchConfetti() {
  const colors = ['#FF6B9D','#FFD93D','#6BCB77','#4D96FF','#FF8C42','#A66CFF']
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div')
    el.style.cssText = `
      position: fixed; left: ${Math.random()*100}vw; top: -20px;
      width: ${6+Math.random()*8}px; height: ${6+Math.random()*8}px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      border-radius: ${Math.random()>0.5?'50%':'2px'};
      z-index: 9999; pointer-events: none;
      transition: transform ${1.5+Math.random()}s ease-out, opacity ${1.5+Math.random()}s;
    `
    document.body.appendChild(el)
    const dx = (Math.random()-0.5)*300
    const dy = 400 + Math.random()*300
    const rot = Math.random()*720
    requestAnimationFrame(() => { el.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`; el.style.opacity = '0' })
    setTimeout(() => el.remove(), 2500)
  }
}

// ---------- emoji helpers ----------
const EMOJIS = ['🍎','🍊','🍋','🍇','🍒','🌸','🐱','🐶','🐰','🦋','🌈','⭐','🎈','🧸','🍪','🐸','🐼','🦄','🌻','🍓']
function randomEmoji() { return EMOJIS[Math.floor(Math.random()*EMOJIS.length)] }

// ---------- topics ----------
const TOPICS = [
  { id: 'counting', label: '🔢 Counting', emoji: '🔢', desc: 'Count the objects!' },
  { id: 'add',      label: '➕ Addition', emoji: '➕', desc: 'Add them up!' },
  { id: 'subtract', label: '➖ Subtraction', emoji: '➖', desc: 'Take some away!' },
  { id: 'compare',  label: '⚖️ Compare', emoji: '⚖️', desc: 'Which is bigger?' },
  { id: 'numbers',  label: '🔤 Numbers', emoji: '🔤', desc: 'Find the number!' },
]

// ---------- question generators ----------
function generateQuestion(topic) {
  const emoji = randomEmoji()
  switch (topic) {
    case 'counting': {
      const n = 1 + Math.floor(Math.random() * 10)
      return { question: `How many ${emoji} are there?`, answer: n, visual: emoji }
    }
    case 'add': {
      const a = 1 + Math.floor(Math.random() * 9)
      const b = 1 + Math.floor(Math.random() * 9)
      return { question: `${emoji} ${a} + ${b} = ?`, answer: a + b, visual: emoji }
    }
    case 'subtract': {
      const a = 2 + Math.floor(Math.random() * 9)
      const b = 1 + Math.floor(Math.random() * (a - 1))
      return { question: `${emoji} ${a} − ${b} = ?`, answer: a - b, visual: emoji }
    }
    case 'compare': {
      const a = 1 + Math.floor(Math.random() * 10)
      const b = 1 + Math.floor(Math.random() * 10)
      const answer = a > b ? '>' : a < b ? '<' : '='
      return {
        question: `Which is correct?  ${a}  ○  ${b}`,
        answer,
        options: ['>', '<', '='],
        visual: { a, b }
      }
    }
    case 'numbers': {
      const n = 1 + Math.floor(Math.random() * 10)
      const wrongs = new Set()
      while (wrongs.size < 3) {
        const w = 1 + Math.floor(Math.random() * 10)
        if (w !== n) wrongs.add(w)
      }
      const opts = [n, ...Array.from(wrongs)].sort(() => Math.random() - 0.5)
      return { question: `Which number is ${n}?`, answer: String(n), options: opts.map(String) }
    }
    default:
      return { question: '1 + 1 = ?', answer: 2 }
  }
}

// ---------- main app ----------
export default function App() {
  const [screen, setScreen] = useState('name') // name | home | play | result
  const [name, setName] = useState('')
  const [topic, setTopic] = useState(null)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mascotMsg, setMascotMsg] = useState("👋 Hi there! What's your name?")

  const starCount = score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0
  const displayName = name.trim() || 'friend'

  const startGame = useCallback((t) => {
    if (!name.trim()) return
    playClick()
    const qs = Array.from({ length: 5 }, () => generateQuestion(t.id))
    setTopic(t)
    setScore(0)
    setStreak(0)
    setQuestions(qs)
    setCurrentQ(qs[0])
    setQIndex(0)
    setSelected(null)
    setFeedback(null)
    setShowConfetti(false)
    setMascotMsg(`🌟 ${displayName}, let's go!`)
    setScreen('play')
  }, [name])

  const handleSelect = useCallback((val) => {
    if (feedback) return
    playClick()
    setSelected(val)
  }, [feedback])

  const submitAnswer = useCallback(() => {
    if (selected === null || !currentQ) return
    const correct = String(currentQ.answer) === String(selected)
    if (correct) {
      playCorrect()
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setFeedback({ type: 'correct', text: getPraise(streak + 1) })
      if (streak + 1 >= 3) {
        playCelebrate()
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2500)
        setTimeout(launchConfetti, 50)
        setMascotMsg('🎉 AWESOME! You\'re on fire! 🔥')
      } else {
        setMascotMsg(getPraise(streak + 1))
      }
    } else {
      playWrong()
      setStreak(0)
      setFeedback({ type: 'wrong', text: `Oops! The answer was ${currentQ.answer}` })
      setMascotMsg(`💪 Almost! Try the next one!`)
    }
  }, [selected, currentQ, streak])

  const nextQuestion = useCallback(() => {
    playClick()
    const next = qIndex + 1
    if (next >= questions.length) {
      if (starCount >= 2) playCelebrate()
      setScreen('result')
      setMascotMsg(
        starCount === 3
          ? `🏆 ${displayName}, PERFECT! You're a math superstar! ⭐⭐⭐`
          : starCount === 2
            ? `🎉 ${displayName}, Great job! Almost perfect! ⭐⭐`
            : `👍 ${displayName}, Good effort! Keep practicing! ⭐`
      )
    } else {
      const q = questions[next]
      setCurrentQ(q)
      setQIndex(next)
      setSelected(null)
      setFeedback(null)
      setMascotMsg('🌟 Next question!')
    }
  }, [qIndex, questions, starCount, displayName])

  const goHome = useCallback(() => {
    playClick()
    setScreen('home')
    setMascotMsg('👋 Let\'s learn math!')
    setName('')
  }, [])

  const renderName = () => (
    <div className="screen name-screen">
      <div className="mascot">🧸</div>
      <h1 className="title">Math for Kids</h1>
      <p className="subtitle">Learning is fun!</p>
      <div className="name-box">
        <label className="name-label">What's your name?</label>
        <input
          className="name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) startGame(TOPICS[0]) }}
          placeholder="Type your name..."
          autoFocus
        />
        <div className="name-chips">
          {['PAULEI','EILA','MARKUS','EUNICE','JADEN','FAE'].map(n => (
            <button key={n} className="name-chip" onClick={() => { setName(n); playClick() }}>{n}</button>
          ))}
        </div>
      </div>
      <button
        className="start-btn"
        onClick={() => startGame(TOPICS[0])}
        disabled={!name.trim()}
      >
        Start Playing 🚀
      </button>
    </div>
  )

  const renderHome = () => (
    <div className="screen home-screen">
      <div className="mascot">🧸</div>
      <h1 className="title">Math for Kids</h1>
      <p className="subtitle">Learning is fun!</p>
      <div className="mascot-msg">{mascotMsg}</div>
      {name && <div className="hello-name">👋 Hi, {displayName}!</div>}
      <div className="topic-grid">
        {TOPICS.map(t => (
          <button key={t.id} className="topic-card" onClick={() => startGame(t)}>
            <span className="topic-emoji">{t.emoji}</span>
            <span className="topic-label">{t.label}</span>
            <span className="topic-desc">{t.desc}</span>
          </button>
        ))}
      </div>
      <div className="stars-display">
        {[1,2,3].map(i => <span key={i} className={`star ${i<=starCount?'show':'hide'}`}>⭐</span>)}
      </div>
    </div>
  )

  const renderPlay = () => {
    if (!currentQ || !topic) return null
    const q = currentQ
    return (
      <div className="screen play-screen">
        <div className="game-header">
          <button className="back-btn" onClick={goHome}>←</button>
          <span className="game-topic-label">{topic.emoji} {topic.label}</span>
          <div className="score-badge">
            ⭐ {score} / {questions.length}
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((qIndex+1)/questions.length)*100}%` }} />
        </div>

        <div className="question-area">
          <div className="question-emoji">{q.emoji || '❓'}</div>
          <div className="question-text">{q.question}</div>
          {q.visual && typeof q.visual === 'object' && !q.visual.emoji && (
            <div className="visual-cmp">
              <span className="cmp-big">{q.visual.a}</span>
              <span className="cmp-oval">○</span>
              <span className="cmp-big">{q.visual.b}</span>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>
            <span className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '🤔'}</span>
            {feedback.text}
          </div>
        )}

        <div className="options-grid">
          {(q.options || makeNumberOptions(q.answer)).map(val => (
            <button
              key={String(val)}
              className={`option-btn ${selected === val ? 'selected' : ''} ${feedback ? (String(val) === String(q.answer) ? 'correct' : (selected === val && feedback.type === 'wrong' ? 'wrong' : '')) : ''}`}
              onClick={() => handleSelect(val)}
              disabled={!!feedback}
            >
              {val}
            </button>
          ))}
        </div>

        {!feedback ? (
          <button className="submit-btn" onClick={submitAnswer} disabled={selected === null}>
            Check Answer ✓
          </button>
        ) : (
          <button className="next-btn" onClick={nextQuestion}>
            {qIndex + 1 >= questions.length ? 'See Results 🎯' : 'Next ➡'}
          </button>
        )}

        <div className="mascot-bottom">{mascotMsg}</div>
      </div>
    )
  }

  const renderResult = () => (
    <div className="screen result-screen">
      <div className="result-emoji">{starCount === 3 ? '🏆' : starCount === 2 ? '🌟' : '👍'}</div>
      <h2 className="result-title">
        {starCount === 3 ? 'Amazing!' : starCount === 2 ? 'Great Job!' : 'Good Try!'}
      </h2>
      <div className="result-score">
        You got <span className="big-score">{score} out of {questions.length}</span> correct!
      </div>
      <div className="result-stars">
        {[1,2,3].map(i => <span key={i} className={`star big ${i<=starCount?'show':'hide'}`}>⭐</span>)}
      </div>
      <div className="result-signed">🎨 Great work, {displayName}!</div>
      <div className="result-msg">{mascotMsg}</div>
      <div className="result-buttons">
        <button className="primary-btn" onClick={goHome}>🏠 Home</button>
        <button className="primary-btn" onClick={() => startGame(topic)}>🔄 Play Again</button>
      </div>
    </div>
  )

  return (
    <div className="app">
      {screen === 'name' && renderName()}
      {screen === 'home' && renderHome()}
      {screen === 'play' && renderPlay()}
      {screen === 'result' && renderResult()}

      {showConfetti && <div className="confetti-overlay" />}
    </div>
  )
}

function getPraise(streak) {
  if (streak >= 5) return '🔥 AMAZING! 5 in a row! You\'re a genius! 🦄'
  if (streak >= 3) return ['🎉 Wonderful!', '⭐ Fantastic!', '🌈 Brilliant!', '🦋 Amazing!', '🎊 Cool!'][streak % 5]
  return ['🌟 Nice!', '👍 Good!', '❤️ Love it!', '⭐ Super!', '🎈 Yay!'][Math.floor(Math.random()*5)]
}

function makeNumberOptions(answer) {
  const opts = new Set([answer])
  while (opts.size < 4) {
    const n = 1 + Math.floor(Math.random() * 10)
    if (n !== answer) opts.add(n)
  }
  return Array.from(opts).sort(() => Math.random() - 0.5)
}
