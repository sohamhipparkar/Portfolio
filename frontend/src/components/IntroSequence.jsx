import { useEffect, useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import carPhoto from '../assets/red.webp'
import MainPortfolioPage from './MainPortfolioPage'

const GREETINGS = [
  'Hello',
  'Bonjour',
  'Ciao',
  '你好',
  'Olá',
  'नमस्ते',
  'こんにちは',
  'Hola',
  'Guten Tag',
]

const FIRST_REVEAL_SYNC_MS = 100
const FIRST_GREETING_HOLD_MS = 950
const MIDDLE_GREETING_HOLD_MS = 200
const FINAL_GREETING_HOLD_MS = 1100

const splitGraphemes = (text) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...segmenter.segment(text)].map((s) => s.segment)
  }
  return Array.from(text)
}

export default function IntroSequence({ MainComponent = MainPortfolioPage }) {
  const [phase, setPhase] = useState('idle')
  const [exhaustWords, setExhaustWords] = useState([])
  const [rpmLevel, setRpmLevel] = useState(0)
  const [lightCount, setLightCount] = useState(0)
  const exhaustTimers = useRef([])
  const rpmInterval = useRef(null)

  // idle -> drive-in
  useEffect(() => {
    if (phase !== 'idle') return
    const t = setTimeout(() => setPhase('drive-in'), 300)
    return () => clearTimeout(t)
  }, [phase])

  // drive-in -> rev
  useEffect(() => {
    if (phase !== 'drive-in') return
    const t = setTimeout(() => setPhase('rev'), 1700)
    return () => clearTimeout(t)
  }, [phase])

  // rev: light sequence + RPM buildup
  useEffect(() => {
    if (phase !== 'rev') return

    let count = 0
    const lightTimer = setInterval(() => {
      count += 1
      setLightCount(count)
      if (count >= 5) clearInterval(lightTimer)
    }, 200)

    let rpm = 0
    rpmInterval.current = setInterval(() => {
      rpm = Math.min(rpm + 4, 95)
      setRpmLevel(rpm)
    }, 18)

    const t = setTimeout(() => {
      setPhase('launch')
      clearInterval(lightTimer)
      clearInterval(rpmInterval.current)
      setRpmLevel(0)
      setLightCount(0)
    }, 420)

    return () => {
      clearTimeout(t)
      clearInterval(lightTimer)
      clearInterval(rpmInterval.current)
    }
  }, [phase])

  // launch -> exhaust
  useEffect(() => {
    if (phase !== 'launch') return

    const t = setTimeout(() => {
      setPhase('exhaust')
      setExhaustWords([
        {
          id: `0-${Date.now()}`,
          word: GREETINGS[0],
          mode: 'reveal',
          style: {
            left: '50%',
            top: '50%',
            fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
            '--settle-x': '-50%',
            '--settle-y': '-50%',
            '--hold-dur': '0.5s',
            '--char-step': '80ms',
            '--char-duration': '360ms',
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

  // cycle greetings
  useEffect(() => {
    if (phase !== 'exhaust') return

    const makeWord = (index) => ({
      id: `${index}-${Date.now()}`,
      word: GREETINGS[index % GREETINGS.length],
      mode: 'hold',
      style: {
        left: '50%',
        top: '50%',
        fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
        '--settle-x': '-50%',
        '--settle-y': '-50%',
        '--hold-dur': '0.5s',
      },
    })

    let greetingIndex = 0
    let isCancelled = false
    const sequenceTimers = []

    const queue = (delay, fn) => {
      const t = setTimeout(fn, delay)
      sequenceTimers.push(t)
    }

    const advanceGreeting = () => {
      if (isCancelled) return
      greetingIndex += 1
      if (greetingIndex >= GREETINGS.length) {
        setPhase('main')
        return
      }
      setExhaustWords([makeWord(greetingIndex)])
      const isFinalGreeting = greetingIndex === GREETINGS.length - 1
      const nextDelay = isFinalGreeting ? FINAL_GREETING_HOLD_MS : MIDDLE_GREETING_HOLD_MS
      queue(nextDelay, advanceGreeting)
    }

    queue(FIRST_REVEAL_SYNC_MS + FIRST_GREETING_HOLD_MS, advanceGreeting)

    return () => {
      isCancelled = true
      sequenceTimers.forEach(clearTimeout)
      setExhaustWords([])
    }
  }, [phase])

  if (phase === 'main') {
    return <MainComponent />
  }

  const isActive = phase !== 'idle'
  const isLaunch = phase === 'launch' || phase === 'exhaust'
  const isRev = phase === 'rev'

  const carClass =
    phase === 'idle'
      ? 'idle'
      : phase === 'drive-in'
        ? 'drive-in'
        : phase === 'rev'
          ? 'rev'
          : 'launch'

  const signalState = isLaunch ? 'green' : isRev ? 'blink' : 'red'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .intro-screen {
          position: fixed;
          inset: 0;
          background: #080808;
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
        }

        /* ── AMBIENT BACKGROUND ── */
        .ambient-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 80%, rgba(200,20,20,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 100% 60% at 50% 100%, rgba(120,0,0,0.12) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0f 0%, #08080c 40%, #0d0508 100%);
          z-index: 0;
        }

        /* ── GRID FLOOR ── */
        .grid-floor {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;
          background-image:
            linear-gradient(rgba(180,10,10,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,10,10,0.15) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(600px) rotateX(65deg);
          transform-origin: bottom center;
          z-index: 1;
          opacity: 0.5;
        }

        .grid-floor::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, transparent 0%, #080808 80%);
        }

        /* ── SCAN LINE OVERLAY ── */
        .scan-lines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          z-index: 2;
          pointer-events: none;
        }

        /* ── RACE STAGE ── */
        .race-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        /* ── SIGNAL LIGHTS ── */
        .signal-panel {
          position: absolute;
          top: clamp(20px, 5vh, 44px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          z-index: 10;
        }

        .signal-bar {
          display: flex;
          gap: 10px;
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          padding: 10px 16px;
          box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .signal-light {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1a0000;
          border: 1.5px solid rgba(255,255,255,0.06);
          transition: background 0.12s ease, box-shadow 0.12s ease;
          position: relative;
        }

        .signal-light::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
        }

        .signal-bar.red .signal-light[data-lit="true"] {
          background: #cc1100;
          box-shadow: 0 0 8px #ff2200, 0 0 20px rgba(255,30,0,0.4);
        }

        .signal-bar.green .signal-light {
          background: #00cc44;
          box-shadow: 0 0 8px #00ff55, 0 0 20px rgba(0,255,80,0.4);
          animation: green-flash 0.08s ease 0s 1;
        }

        @keyframes green-flash {
          0% { background: #fff; box-shadow: 0 0 40px #fff; }
          100% { background: #00cc44; box-shadow: 0 0 8px #00ff55, 0 0 20px rgba(0,255,80,0.4); }
        }

        .signal-bar.blink .signal-light {
          animation: red-blink 0.12s ease-in-out infinite alternate;
        }

        @keyframes red-blink {
          from { background: #1a0000; box-shadow: none; }
          to { background: #cc1100; box-shadow: 0 0 8px #ff2200, 0 0 20px rgba(255,30,0,0.5); }
        }

        /* ── RPM BAR ── */
        .rpm-panel {
          position: absolute;
          bottom: clamp(24px, 6vh, 52px);
          left: 50%;
          transform: translateX(-50%);
          width: clamp(200px, 40vw, 340px);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .rpm-panel.visible { opacity: 1; }

        .rpm-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }

        .rpm-track {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .rpm-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #8b0000 0%, #cc1100 60%, #ff4400 85%, #ffaa00 100%);
          transition: width 0.016s linear;
          position: relative;
        }

        .rpm-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: -3px;
          width: 8px;
          height: 10px;
          background: #ffcc00;
          border-radius: 1px;
          box-shadow: 0 0 8px #ffaa00, 0 0 16px rgba(255,170,0,0.6);
        }

        .rpm-ticks {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .rpm-tick {
          width: 1px;
          height: 4px;
          background: rgba(255,255,255,0.12);
        }

        /* ── SPEED LINES (right -> left) ── */
        .speed-lines {
          position: absolute;
          inset: 0;
          z-index: 4;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .is-launch .speed-lines { opacity: 1; }

        .speed-line {
          position: absolute;
          height: 1px;
          right: 0;
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.6), transparent);
          transform-origin: right center;
          animation: speedLine 0.3s linear infinite;
        }

        @keyframes speedLine {
          from { width: 0; opacity: 1; }
          to   { width: 70vw; opacity: 0; }
        }

        /* ── CAR WRAP ── */
        .f1-car-wrap {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(280px, 42vw, 560px);
          z-index: 6;
        }

        .car-photo {
          width: 100%;
          display: block;
          transform: none;
          filter: drop-shadow(0 8px 30px rgba(200,10,10,0.35)) drop-shadow(0 0 60px rgba(150,0,0,0.2));
        }

        .f1-car-wrap.idle {
          transform: translateX(-130vw);
          transition: none;
        }

        .f1-car-wrap.drive-in {
          transform: translateX(-50%);
          transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
          filter: drop-shadow(0 0 20px rgba(200,10,10,0.2));
        }

        .f1-car-wrap.rev {
          transform: translateX(-50%) translateX(2px);
          animation: car-rev 0.08s ease-in-out infinite alternate;
        }

        @keyframes car-rev {
          from { transform: translateX(calc(-50% - 1px)) translateY(0px) rotate(-0.3deg); }
          to   { transform: translateX(calc(-50% + 2px)) translateY(1px) rotate(0.3deg); }
        }

        .f1-car-wrap.launch {
          animation: car-launch 0.55s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        @keyframes car-launch {
          0%   { transform: translateX(-50%) scaleX(1);    filter: blur(0px)  brightness(1); }
          15%  { transform: translateX(-50%) scaleX(0.94); filter: blur(0px)  brightness(1.4); }
          100% { transform: translateX(200vw) scaleX(1.3); filter: blur(12px) brightness(2.5); }
        }

        .car-ground-glow {
          position: absolute;
          bottom: -8px;
          left: 15%;
          right: 15%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(200,10,10,0.5) 0%, transparent 70%);
          filter: blur(6px);
        }

        /* ── EXHAUST / GREETING STAGE ── */
        .exhaust-stage {
          position: absolute;
          inset: 0;
          z-index: 8;
          pointer-events: none;
        }

        .exhaust-word {
          position: absolute;
          display: flex;
          gap: 0;
          transform: translate(var(--settle-x, -50%), var(--settle-y, -50%));
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.06em;
          text-shadow:
            0 0 40px rgba(255,30,0,0.8),
            0 0 80px rgba(200,0,0,0.4),
            0 2px 0 rgba(0,0,0,0.8);
          white-space: nowrap;
        }

        .exhaust-word.reveal .greeting-char {
          opacity: 0;
          transform: translateY(18px) scaleY(0.6);
          animation: char-in var(--char-duration, 380ms) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(
            var(--char-start-delay, 20ms) + var(--char-index) * var(--char-step, 90ms)
          );
          display: inline-block;
        }

        @keyframes char-in {
          from {
            opacity: 0;
            transform: translateY(20px) scaleY(0.5) rotateX(40deg);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1) rotateX(0deg);
            filter: blur(0px);
          }
        }

        .exhaust-word.hold .greeting-char {
          display: inline-block;
          animation: char-swap 0.14s cubic-bezier(0.4, 0, 0.2, 1) both;
          animation-delay: calc(var(--char-index, 0) * 18ms);
        }

        @keyframes char-swap {
          0%   { opacity: 0; transform: translateY(-8px) scaleY(0.7); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }

        .exhaust-word::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,30,0,0.8), transparent);
          animation: line-expand 0.4s ease-out 0.2s both;
          transform-origin: center;
        }

        @keyframes line-expand {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* ── CORNER DECO ── */
        .corner-deco {
          position: absolute;
          z-index: 9;
          width: 60px;
          height: 60px;
          opacity: 0.25;
        }

        .corner-deco.tl { top: 20px; left: 20px; border-top: 2px solid #cc1100; border-left: 2px solid #cc1100; }
        .corner-deco.tr { top: 20px; right: 20px; border-top: 2px solid #cc1100; border-right: 2px solid #cc1100; }
        .corner-deco.bl { bottom: 20px; left: 20px; border-bottom: 2px solid #cc1100; border-left: 2px solid #cc1100; }
        .corner-deco.br { bottom: 20px; right: 20px; border-bottom: 2px solid #cc1100; border-right: 2px solid #cc1100; }

        /* ── TEAM LOGO / WORDMARK (top-left) ── */
        .intro-wordmark {
          position: absolute;
          top: clamp(18px, 4vh, 36px);
          left: clamp(20px, 4vw, 40px);
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(10px, 1.2vw, 13px);
          font-weight: 700;
          letter-spacing: 6px;
          color: rgba(255,255,255,0.18);
          text-transform: uppercase;
          z-index: 10;
        }

        /* ── GEAR INDICATOR (top-right) ── */
        .gear-indicator {
          position: absolute;
          top: clamp(18px, 4vh, 36px);
          right: clamp(20px, 4vw, 40px);
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          color: rgba(255,255,255,0.07);
          z-index: 10;
          transition: color 0.2s, text-shadow 0.2s;
          letter-spacing: -2px;
        }

        .gear-indicator.active {
          color: rgba(200,10,10,0.6);
          text-shadow: 0 0 20px rgba(255,0,0,0.3);
        }
      `}</style>

      <div className="intro-screen" aria-live="polite">
        <div className="ambient-bg" />
        <div className="grid-floor" />
        <div className="scan-lines" />

        <div className="corner-deco tl" />
        <div className="corner-deco tr" />
        <div className="corner-deco bl" />
        <div className="corner-deco br" />

        <div className="intro-wordmark">Portfolio</div>

        <div className={`gear-indicator ${isRev || isLaunch ? 'active' : ''}`}>
          {isLaunch ? '1' : isRev ? 'N' : 'P'}
        </div>

        <div className={`race-stage ${isActive ? 'active' : ''} ${isLaunch ? 'is-launch' : ''}`}>

          {/* Signal Lights */}
          <div className="signal-panel">
            <div className={`signal-bar ${signalState}`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="signal-light"
                  data-lit={isRev ? String(i < lightCount) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Speed Lines */}
          <div className="speed-lines">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="speed-line"
                style={{
                  top: `${8 + i * 6.5}%`,
                  animationDelay: `${(i * 0.07) % 0.3}s`,
                  animationDuration: `${0.22 + (i % 3) * 0.06}s`,
                  opacity: 0.3 + (i % 4) * 0.15,
                }}
              />
            ))}
          </div>

          {/* Car */}
          <div className={`f1-car-wrap ${carClass}`}>
            <div className="car-ground-glow" />
            <img className="car-photo" src={carPhoto} alt="Formula 1 car" />
          </div>

          {/* RPM Panel */}
          <div className={`rpm-panel ${isRev ? 'visible' : ''}`}>
            <div className="rpm-label">Engine RPM</div>
            <div className="rpm-track">
              <div className="rpm-fill" style={{ width: `${rpmLevel}%` }} />
            </div>
            <div className="rpm-ticks">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="rpm-tick" />
              ))}
            </div>
          </div>

          {/* Greeting Stage */}
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
                    style={{ '--char-index': i, whiteSpace: 'pre' }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <Analytics />
      </div>
    </>
  )
}