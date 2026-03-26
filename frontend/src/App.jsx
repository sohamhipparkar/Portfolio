import { useEffect, useRef, useState } from 'react'
import carPhoto from './assets/red.webp'
import './App.css'

const GREETINGS = [
  'Hello', 'Hola', 'Bonjour', 'Ciao', 'नमस्ते', 'Hallo', 'Salaam', 'Olá',
]

const WORD_INTERVAL_MS = 430
const FIRST_REVEAL_SYNC_MS = 760

const splitGraphemes = (text) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...segmenter.segment(text)].map((s) => s.segment)
  }
  return Array.from(text)
}

export default function App() {
  const [phase, setPhase]               = useState('idle')
  const [exhaustWords, setExhaustWords] = useState([])
  const glowRef                         = useRef(null)
  const exhaustTimers                   = useRef([])

  // idle → drive-in
  useEffect(() => {
    if (phase !== 'idle') return
    const t = setTimeout(() => setPhase('drive-in'), 300)
    return () => clearTimeout(t)
  }, [phase])

  // drive-in → rev (brief rev pause before launch)
  useEffect(() => {
    if (phase !== 'drive-in') return
    const t = setTimeout(() => setPhase('rev'), 1700)
    return () => clearTimeout(t)
  }, [phase])

  // rev → launch
  useEffect(() => {
    if (phase !== 'rev') return
    const t = setTimeout(() => setPhase('launch'), 420)
    return () => clearTimeout(t)
  }, [phase])

  // launch → exhaust: spawn first greeting + glow
  useEffect(() => {
    if (phase !== 'launch') return

    const t = setTimeout(() => {
      setPhase('exhaust')

      const vw = window.innerWidth
      const vh = window.innerHeight
      const tailX = vw * 0.5
      const carY  = vh * 0.5

      if (glowRef.current) {
        glowRef.current.style.left = `${tailX}px`
        glowRef.current.classList.add('visible')
        const gOff = setTimeout(
          () => glowRef.current?.classList.remove('visible'),
          800,
        )
        exhaustTimers.current.push(gOff)
      }

      setExhaustWords([
        {
          id: `0-${Date.now()}`,
          word: GREETINGS[0],
          mode: 'reveal',
          style: {
            left: '50%',
            top: '50%',
            fontSize: 'clamp(2.8rem, 8vw, 4.4rem)',
            '--settle-x': '-50%',
            '--settle-y': '-50%',
            '--hold-dur': '0.48s',
            '--char-step': '90ms',
            '--char-duration': '380ms',
            '--char-start-delay': '20ms',
          },
        },
      ])
    }, 0)

    exhaustTimers.current.push(t)
    return () => {
      exhaustTimers.current.forEach(clearTimeout)
      exhaustTimers.current = []
    }
  }, [phase])

  // cycle greetings during exhaust
  useEffect(() => {
    if (phase !== 'exhaust') return

    const makeWord = (index) => ({
      id: `${index}-${Date.now()}`,
      word: GREETINGS[index % GREETINGS.length],
      mode: 'hold',
      style: {
        left: '50%',
        top: '50%',
        fontSize: 'clamp(2.8rem, 8vw, 4.4rem)',
        '--settle-x': '-50%',
        '--settle-y': '-50%',
        '--hold-dur': '0.48s',
      },
    })

    let current = 0
    let wordTimer

    const startT = setTimeout(() => {
      wordTimer = setInterval(() => {
        current += 1
        setExhaustWords([makeWord(current)])
      }, WORD_INTERVAL_MS)
    }, FIRST_REVEAL_SYNC_MS)

    return () => {
      clearTimeout(startT)
      clearInterval(wordTimer)
      setExhaustWords([])
    }
  }, [phase])

  // exhaust → main
  useEffect(() => {
    if (phase !== 'exhaust') return
    const t = setTimeout(() => setPhase('main'), 2900)
    return () => clearTimeout(t)
  }, [phase])

  // ─────────────────────────────────
  if (phase === 'main') {
    return (
      <main className="main-page">
        <section className="hero-card">
          <p className="hero-kicker">Portfolio</p>
          <h1>Hi, I am Soham.</h1>
          <p>
            Welcome to my corner of the internet — where I build fast,
            polished, and memorable digital experiences.
          </p>
        </section>
      </main>
    )
  }

  const isActive  = phase !== 'idle'
  const isLaunch  = phase === 'launch' || phase === 'exhaust'
  const isRev     = phase === 'rev'
  const carClass  =
    phase === 'idle'     ? 'idle'     :
    phase === 'drive-in' ? 'drive-in' :
    phase === 'rev'      ? 'rev'      : 'launch'

  return (
    <div className="intro-screen" aria-live="polite">
      <div
        className={`race-stage ${isActive ? 'active' : ''} ${isLaunch ? 'is-launch' : ''}`}
      >
        {/* Signal lights */}
        <div
          className={`race-signals ${
            isLaunch ? 'green' : isRev ? 'blink' : 'red'
          }`}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="signal-light" />
          ))}
        </div>

        <div className="race-horizon" />

        {/* Speed lines — only during launch */}
        <div className="speed-lines" />

        {/* Ground reflection strip */}
        <div className="track-surface" />

        {/* Car */}
        <div className={`f1-car-wrap ${carClass}`}>
          {/* Heat haze shimmer under car */}
          <div className="heat-haze" />
          <img className="car-photo" src={carPhoto} alt="Formula 1 car" />
          {/* Wheel motion blur dots */}
          <div className={`wheel-blur ${isLaunch ? 'spinning' : ''}`} />
        </div>

        {/* Exhaust glow */}
        <div ref={glowRef} className="exhaust-glow" />

        {/* Exhaust word particles */}
        <div className="exhaust-stage">
          {exhaustWords.map(({ id, word, style, mode }) => (
            <span
              key={id}
              className={`exhaust-word ${mode ?? 'hold'}`}
              style={style}
            >
              {splitGraphemes(word).map((char, i) => (
                <span
                  key={`${id}-c${i}`}
                  className="greeting-char"
                  style={{ '--char-index': i }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}