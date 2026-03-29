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
  const [particles, setParticles] = useState([])
  const [launchFlash, setLaunchFlash] = useState(false)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const exhaustTimers = useRef([])
  const rpmInterval = useRef(null)
  const particleInterval = useRef(null)

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
      setLaunchFlash(true)
      setTimeout(() => setLaunchFlash(false), 300)
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

  // Spawn particles during rev & launch
  useEffect(() => {
    if (phase !== 'rev' && phase !== 'exhaust') {
      setParticles([])
      clearInterval(particleInterval.current)
      return
    }

    const spawn = () => {
      setParticles(prev => {
        const fresh = [...Array(phase === 'rev' ? 2 : 4)].map((_, i) => ({
          id: `p-${Date.now()}-${i}`,
          x: 48 + Math.random() * 8,
          y: 55 + Math.random() * 10,
          vx: -(1 + Math.random() * 3),
          size: 2 + Math.random() * 4,
          life: 1,
          hue: Math.random() > 0.5 ? 'ember' : 'spark',
        }))
        return [...prev.slice(-40), ...fresh]
      })
    }

    particleInterval.current = setInterval(spawn, 60)
    return () => clearInterval(particleInterval.current)
  }, [phase])

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return
    const raf = requestAnimationFrame(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, x: p.x + p.vx * 0.4, y: p.y + 0.2, life: p.life - 0.035 }))
          .filter(p => p.life > 0)
      )
    })
    return () => cancelAnimationFrame(raf)
  }, [particles])

  // launch -> exhaust
  useEffect(() => {
    if (phase !== 'launch') return

    const t = setTimeout(() => {
      setPhase('exhaust')
      setGreetingIndex(0)
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

    let idx = 0
    let isCancelled = false
    const sequenceTimers = []

    const queue = (delay, fn) => {
      const t = setTimeout(fn, delay)
      sequenceTimers.push(t)
    }

    const advanceGreeting = () => {
      if (isCancelled) return
      idx += 1
      setGreetingIndex(idx)
      if (idx >= GREETINGS.length) {
        setPhase('main')
        return
      }
      setExhaustWords([makeWord(idx)])
      const isFinal = idx === GREETINGS.length - 1
      queue(isFinal ? FINAL_GREETING_HOLD_MS : MIDDLE_GREETING_HOLD_MS, advanceGreeting)
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
  const isDriveIn = phase === 'drive-in'

  const carClass =
    phase === 'idle' ? 'idle'
    : phase === 'drive-in' ? 'drive-in'
    : phase === 'rev' ? 'rev'
    : 'launch'

  const signalState = isLaunch ? 'green' : isRev ? 'blink' : 'red'
  const progress = (greetingIndex / (GREETINGS.length - 1)) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red: #cc1100;
          --red-bright: #ff2200;
          --red-glow: rgba(255,30,0,0.5);
          --red-dim: rgba(200,10,10,0.15);
          --gold: #ffaa00;
          --gold-glow: rgba(255,170,0,0.6);
          --white: #ffffff;
          --bg: #06060a;
          --surface: rgba(10,10,14,0.92);
        }

        .intro-screen {
          position: fixed;
          inset: 0;
          background: var(--bg);
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
          cursor: none;
        }

        /* ── LAYERED AMBIENT ── */
        .ambient-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 50% 90%, rgba(200,20,20,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 50% 30% at 20% 50%, rgba(80,0,0,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 80% 50%, rgba(80,0,0,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #080810 0%, #06060a 50%, #0e0406 100%);
          z-index: 0;
          animation: ambient-pulse 4s ease-in-out infinite alternate;
        }

        @keyframes ambient-pulse {
          from { opacity: 0.8; }
          to   { opacity: 1; }
        }

        /* ── NOISE TEXTURE ── */
        .noise {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
          pointer-events: none;
        }

        /* ── VIGNETTE ── */
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.75) 100%);
          z-index: 12;
          pointer-events: none;
        }

        /* ── GRID FLOOR ── */
        .grid-floor {
          position: absolute;
          bottom: 0;
          left: -10%;
          right: -10%;
          height: 60%;
          background-image:
            linear-gradient(rgba(180,10,10,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,10,10,0.18) 1px, transparent 1px);
          background-size: 64px 64px;
          transform: perspective(700px) rotateX(68deg);
          transform-origin: bottom center;
          z-index: 1;
          opacity: 0.55;
          animation: grid-scroll 3s linear infinite;
        }

        @keyframes grid-scroll {
          from { background-position: 0 0; }
          to   { background-position: 0 64px; }
        }

        .grid-floor::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, transparent 0%, var(--bg) 75%);
        }

        /* ── HORIZON GLOW ── */
        .horizon-glow {
          position: absolute;
          bottom: 33%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 5%, rgba(200,10,10,0.4) 30%, rgba(255,50,0,0.7) 50%, rgba(200,10,10,0.4) 70%, transparent 95%);
          z-index: 2;
          filter: blur(1px);
          box-shadow: 0 0 20px rgba(200,10,10,0.3), 0 0 60px rgba(150,0,0,0.15);
        }

        /* ── SCAN LINES ── */
        .scan-lines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
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
          background: rgba(6,6,10,0.95);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 12px 18px;
          box-shadow:
            0 0 40px rgba(0,0,0,0.9),
            0 2px 0 rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .signal-bar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .signal-light {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #120000;
          border: 1.5px solid rgba(255,255,255,0.05);
          transition: background 0.1s ease, box-shadow 0.1s ease;
          position: relative;
        }

        .signal-light::after {
          content: '';
          position: absolute;
          top: 4px; left: 4px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }

        .signal-bar.red .signal-light[data-lit="true"] {
          background: #cc1100;
          box-shadow: 0 0 10px #ff2200, 0 0 24px rgba(255,30,0,0.5), 0 0 40px rgba(200,0,0,0.2);
        }

        .signal-bar.green .signal-light {
          background: #00cc44;
          box-shadow: 0 0 10px #00ff55, 0 0 24px rgba(0,255,80,0.5);
          animation: green-flash 0.1s ease 0s 1;
        }

        @keyframes green-flash {
          0%   { background: #ffffff; box-shadow: 0 0 60px #fff, 0 0 100px rgba(255,255,255,0.8); }
          100% { background: #00cc44; box-shadow: 0 0 10px #00ff55, 0 0 24px rgba(0,255,80,0.5); }
        }

        .signal-bar.blink .signal-light {
          animation: red-blink 0.11s ease-in-out infinite alternate;
        }

        @keyframes red-blink {
          from { background: #120000; box-shadow: none; }
          to   { background: #cc1100; box-shadow: 0 0 10px #ff2200, 0 0 24px rgba(255,30,0,0.6); }
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
          gap: 8px;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .rpm-panel.visible { opacity: 1; }

        .rpm-header {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: baseline;
        }

        .rpm-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }

        .rpm-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,170,0,0.8);
          letter-spacing: 1px;
          transition: color 0.1s;
        }

        .rpm-track {
          width: 100%;
          height: 5px;
          background: rgba(255,255,255,0.05);
          border-radius: 3px;
          overflow: visible;
          position: relative;
        }

        .rpm-track::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .rpm-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg,
            #6b0000 0%,
            #cc1100 50%,
            #ff4400 78%,
            #ffaa00 90%,
            #ffffff 100%
          );
          transition: width 0.016s linear;
          position: relative;
        }

        .rpm-fill::after {
          content: '';
          position: absolute;
          right: -1px;
          top: -4px;
          width: 3px;
          height: 13px;
          background: #ffcc00;
          border-radius: 2px;
          box-shadow: 0 0 10px #ffaa00, 0 0 20px rgba(255,170,0,0.7);
        }

        .rpm-ticks {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .rpm-tick {
          width: 1px;
          height: 4px;
          background: rgba(255,255,255,0.1);
        }

        .rpm-tick:nth-child(4n) {
          height: 7px;
          background: rgba(255,255,255,0.2);
        }

        /* ── LAUNCH FLASH ── */
        .launch-flash {
          position: absolute;
          inset: 0;
          background: rgba(255,200,100,0.12);
          z-index: 20;
          pointer-events: none;
          animation: flash-out 0.4s ease-out forwards;
        }

        @keyframes flash-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }

        /* ── SPEED LINES ── */
        .speed-lines {
          position: absolute;
          inset: 0;
          z-index: 4;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s;
        }

        .is-launch .speed-lines { opacity: 1; }

        .speed-line {
          position: absolute;
          height: 1px;
          right: 0;
          background: linear-gradient(to left, transparent, rgba(255,255,255,0.7), rgba(255,255,255,0.2), transparent);
          transform-origin: right center;
          animation: speedLine var(--dur, 0.28s) linear infinite;
        }

        @keyframes speedLine {
          from { width: 0; opacity: 1; right: 0; }
          to   { width: 80vw; opacity: 0; right: 0; }
        }

        /* ── CAR WRAP ── */
        .f1-car-wrap {
          position: absolute;
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(280px, 45vw, 580px);
          z-index: 6;
        }

        .car-photo {
          width: 100%;
          display: block;
          filter:
            drop-shadow(0 10px 40px rgba(200,10,10,0.4))
            drop-shadow(0 0 80px rgba(150,0,0,0.2))
            drop-shadow(0 -2px 12px rgba(255,50,0,0.1));
        }

        .f1-car-wrap.idle {
          transform: translateX(-150vw);
          transition: none;
        }

        .f1-car-wrap.drive-in {
          transform: translateX(-50%);
          transition: transform 1.3s cubic-bezier(0.14, 1, 0.34, 1);
        }

        .f1-car-wrap.rev {
          animation: car-rev 0.09s ease-in-out infinite alternate;
        }

        @keyframes car-rev {
          from { transform: translateX(calc(-50% - 1.5px)) translateY(0px) rotate(-0.4deg); }
          to   { transform: translateX(calc(-50% + 1.5px)) translateY(1.5px) rotate(0.4deg); }
        }

        .f1-car-wrap.launch {
          animation: car-launch 0.6s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        @keyframes car-launch {
          0%   { transform: translateX(-50%) scaleX(1);    filter: blur(0px)  brightness(1); }
          8%   { transform: translateX(-53%) scaleX(0.93); filter: blur(0px)  brightness(1.6); }
          20%  { transform: translateX(-45%) scaleX(1.05); filter: blur(2px)  brightness(2); }
          100% { transform: translateX(210vw) scaleX(1.4); filter: blur(18px) brightness(3); }
        }

        .car-ground-glow {
          position: absolute;
          bottom: -12px;
          left: 10%;
          right: 10%;
          height: 24px;
          background: radial-gradient(ellipse, rgba(200,10,10,0.6) 0%, transparent 70%);
          filter: blur(8px);
          animation: glow-pulse 1.2s ease-in-out infinite alternate;
        }

        @keyframes glow-pulse {
          from { opacity: 0.6; transform: scaleX(0.95); }
          to   { opacity: 1; transform: scaleX(1.05); }
        }

        /* Tire smoke during rev */
        .tire-smoke {
          position: absolute;
          bottom: -5px;
          right: 20%;
          width: 60px;
          height: 30px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .f1-car-wrap.rev .tire-smoke { opacity: 1; }

        .smoke-puff {
          position: absolute;
          border-radius: 50%;
          background: rgba(200,180,160,0.15);
          filter: blur(8px);
          animation: smoke-drift 0.9s ease-out infinite;
        }

        .smoke-puff:nth-child(2) { animation-delay: 0.3s; width: 20px; height: 20px; bottom: 5px; right: 0; }
        .smoke-puff:nth-child(3) { animation-delay: 0.6s; width: 14px; height: 14px; bottom: 10px; right: 10px; }

        @keyframes smoke-drift {
          from { transform: translateX(0) translateY(0) scale(0.5); opacity: 0.5; }
          to   { transform: translateX(-40px) translateY(-20px) scale(2); opacity: 0; }
        }

        /* ── PARTICLE LAYER ── */
        .particle-layer {
          position: absolute;
          inset: 0;
          z-index: 7;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle.ember {
          background: radial-gradient(circle, #ffcc00 0%, #ff4400 50%, transparent 100%);
        }

        .particle.spark {
          background: radial-gradient(circle, #ffffff 0%, #ff8800 40%, transparent 100%);
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
          letter-spacing: 0.08em;
          text-shadow:
            0 0 30px rgba(255,40,0,0.9),
            0 0 70px rgba(200,0,0,0.5),
            0 0 120px rgba(150,0,0,0.2),
            0 2px 0 rgba(0,0,0,0.9);
          white-space: nowrap;
        }

        .exhaust-word.reveal .greeting-char {
          opacity: 0;
          transform: translateY(22px) scaleY(0.5);
          animation: char-in var(--char-duration, 380ms) cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(
            var(--char-start-delay, 20ms) + var(--char-index) * var(--char-step, 90ms)
          );
          display: inline-block;
        }

        @keyframes char-in {
          0%   { opacity: 0; transform: translateY(24px) scaleY(0.4) rotateX(50deg); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleY(1) rotateX(0deg); filter: blur(0px); }
        }

        .exhaust-word.hold .greeting-char {
          display: inline-block;
          animation: char-swap 0.15s cubic-bezier(0.4, 0, 0.2, 1) both;
          animation-delay: calc(var(--char-index, 0) * 16ms);
        }

        @keyframes char-swap {
          0%   { opacity: 0; transform: translateY(-10px) scaleY(0.6) rotateX(30deg); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scaleY(1) rotateX(0deg); filter: blur(0); }
        }

        /* Underline accent */
        .exhaust-word::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,40,0,0.6) 20%, rgba(255,150,0,0.9) 50%, rgba(255,40,0,0.6) 80%, transparent 100%);
          animation: line-expand 0.5s ease-out 0.15s both;
          transform-origin: center;
          filter: blur(0.5px);
        }

        @keyframes line-expand {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* Progress dots */
        .greeting-dots {
          position: absolute;
          bottom: calc(var(--settle-y, -50%) + 24px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          margin-top: 20px;
        }

        /* ── PROGRESS BAR (exhaust phase) ── */
        .greeting-progress {
          position: absolute;
          bottom: clamp(24px, 5vh, 44px);
          left: 50%;
          transform: translateX(-50%);
          width: clamp(120px, 25vw, 220px);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          opacity: 0;
          transition: opacity 0.4s 0.3s;
        }

        .greeting-progress.visible { opacity: 1; }

        .progress-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
        }

        .progress-track {
          width: 100%;
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--red), var(--gold));
          border-radius: 1px;
          transition: width 0.2s ease;
        }

        /* ── CORNER DECO ── */
        .corner-deco {
          position: absolute;
          z-index: 9;
          width: 50px;
          height: 50px;
          opacity: 0.2;
          transition: opacity 0.5s;
        }

        .corner-deco.active { opacity: 0.4; }

        .corner-deco.tl { top: 18px; left: 18px; border-top: 1.5px solid #cc1100; border-left: 1.5px solid #cc1100; border-radius: 2px 0 0 0; }
        .corner-deco.tr { top: 18px; right: 18px; border-top: 1.5px solid #cc1100; border-right: 1.5px solid #cc1100; border-radius: 0 2px 0 0; }
        .corner-deco.bl { bottom: 18px; left: 18px; border-bottom: 1.5px solid #cc1100; border-left: 1.5px solid #cc1100; border-radius: 0 0 0 2px; }
        .corner-deco.br { bottom: 18px; right: 18px; border-bottom: 1.5px solid #cc1100; border-right: 1.5px solid #cc1100; border-radius: 0 0 2px 0; }

        /* Corner dots */
        .corner-deco::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--red);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--red);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .corner-deco.active::after { opacity: 1; }
        .corner-deco.tl::after { top: -2px; left: -2px; }
        .corner-deco.tr::after { top: -2px; right: -2px; }
        .corner-deco.bl::after { bottom: -2px; left: -2px; }
        .corner-deco.br::after { bottom: -2px; right: -2px; }

        /* ── TELEMETRY (HUD elements) ── */
        .telemetry-left {
          position: absolute;
          bottom: clamp(60px, 12vh, 100px);
          left: clamp(20px, 4vw, 48px);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .telemetry-left.visible { opacity: 1; }

        .telem-row {
          display: flex;
          gap: 10px;
          align-items: baseline;
        }

        .telem-key {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          width: 36px;
        }

        .telem-val {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,40,0,0.7);
          letter-spacing: 1px;
        }

        /* ── TEAM LOGO ── */
        .intro-wordmark {
          position: absolute;
          top: clamp(18px, 4vh, 36px);
          left: clamp(20px, 4vw, 40px);
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(9px, 1.1vw, 12px);
          font-weight: 700;
          letter-spacing: 7px;
          color: rgba(255,255,255,0.15);
          text-transform: uppercase;
          z-index: 10;
          transition: color 0.6s, letter-spacing 0.6s;
        }

        .intro-wordmark.active {
          color: rgba(255,255,255,0.25);
          letter-spacing: 8px;
        }

        /* ── GEAR INDICATOR ── */
        .gear-indicator {
          position: absolute;
          top: clamp(18px, 4vh, 36px);
          right: clamp(20px, 4vw, 40px);
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 900;
          color: rgba(255,255,255,0.05);
          z-index: 10;
          transition: color 0.2s, text-shadow 0.2s, transform 0.2s;
          letter-spacing: -2px;
        }

        .gear-indicator.active {
          color: rgba(200,10,10,0.7);
          text-shadow: 0 0 30px rgba(255,0,0,0.4), 0 0 60px rgba(200,0,0,0.2);
          transform: scale(1.05);
        }

        .gear-indicator.launch {
          color: rgba(0,180,60,0.8);
          text-shadow: 0 0 30px rgba(0,255,80,0.5), 0 0 60px rgba(0,200,60,0.25);
          animation: gear-pop 0.15s ease-out;
        }

        @keyframes gear-pop {
          0%   { transform: scale(1.5); }
          100% { transform: scale(1.05); }
        }

        /* ── MOBILE ── */
        @media (max-width: 480px) {
          .signal-panel { top: clamp(52px, 10vh, 72px); }
          .intro-wordmark { left: clamp(32px, 8vw, 56px); }
          .gear-indicator { right: clamp(32px, 8vw, 56px); }
          .telemetry-left { display: none; }
        }
      `}</style>

      <div className="intro-screen" aria-live="polite">
        <div className="ambient-bg" />
        <div className="noise" />
        <div className="grid-floor" />
        <div className="horizon-glow" />
        <div className="scan-lines" />
        <div className="vignette" />

        {/* Corner decorations */}
        <div className={`corner-deco tl ${isActive ? 'active' : ''}`} />
        <div className={`corner-deco tr ${isActive ? 'active' : ''}`} />
        <div className={`corner-deco bl ${isActive ? 'active' : ''}`} />
        <div className={`corner-deco br ${isActive ? 'active' : ''}`} />

        <div className={`intro-wordmark ${isActive ? 'active' : ''}`}>Portfolio</div>

        <div className={`gear-indicator ${isLaunch ? 'launch' : isRev ? 'active' : ''}`}>
          {isLaunch ? '1' : isRev ? 'N' : 'P'}
        </div>

        {/* Telemetry sidebar */}
        <div className={`telemetry-left ${isRev || isLaunch ? 'visible' : ''}`}>
          <div className="telem-row">
            <span className="telem-key">SPD</span>
            <span className="telem-val">{isRev ? `${Math.round(rpmLevel * 3.2)}` : isLaunch ? '340' : '0'} KM/H</span>
          </div>
          <div className="telem-row">
            <span className="telem-key">LAP</span>
            <span className="telem-val">1:24.{isRev ? Math.round(rpmLevel * 0.35).toString().padStart(3, '0') : '000'}</span>
          </div>
          <div className="telem-row">
            <span className="telem-key">GRIP</span>
            <span className="telem-val">{isRev ? `${Math.round(60 + rpmLevel * 0.4)}%` : '100%'}</span>
          </div>
        </div>

        {/* Launch flash overlay */}
        {launchFlash && <div className="launch-flash" />}

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
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="speed-line"
                style={{
                  top: `${5 + i * 5.2}%`,
                  '--dur': `${0.2 + (i % 4) * 0.05}s`,
                  animationDelay: `${(i * 0.065) % 0.3}s`,
                  opacity: 0.25 + (i % 4) * 0.18,
                  height: i % 3 === 0 ? '2px' : '1px',
                }}
              />
            ))}
          </div>

          {/* Car */}
          <div className={`f1-car-wrap ${carClass}`}>
            <div className="car-ground-glow" />
            <div className="tire-smoke">
              <div className="smoke-puff" style={{ width: 30, height: 30, bottom: 0, right: 5 }} />
              <div className="smoke-puff" />
              <div className="smoke-puff" />
            </div>
            <img className="car-photo" src={carPhoto} alt="Formula 1 car" />
          </div>

          {/* Particles */}
          <div className="particle-layer">
            {particles.map(p => (
              <div
                key={p.id}
                className={`particle ${p.hue}`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  opacity: p.life,
                }}
              />
            ))}
          </div>

          {/* RPM Panel */}
          <div className={`rpm-panel ${isRev ? 'visible' : ''}`}>
            <div className="rpm-header">
              <div className="rpm-label">Engine RPM</div>
              <div className="rpm-value">{Math.round(rpmLevel * 180).toLocaleString()}</div>
            </div>
            <div className="rpm-track">
              <div className="rpm-fill" style={{ width: `${rpmLevel}%` }} />
            </div>
            <div className="rpm-ticks">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="rpm-tick" />
              ))}
            </div>
          </div>

          {/* Greeting Progress */}
          <div className={`greeting-progress ${phase === 'exhaust' ? 'visible' : ''}`}>
            <div className="progress-label">Loading</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
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