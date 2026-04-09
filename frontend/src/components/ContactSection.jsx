import { ArrowUpRight, Radio } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Barlow+Condensed:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  :root {
    --red: #E8002D;
    --red-dim: rgba(232,0,45,0.12);
    --red-glow: rgba(232,0,45,0.35);
    --white: #F0EDE8;
    --off-white: #C8C4BC;
    --mid: #6B6660;
    --dark: #0E0C0B;
    --panel: #141210;
    --border: rgba(240,237,232,0.08);
    --border-active: rgba(232,0,45,0.5);
  }

  .cs-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .cs-root {
    background: var(--dark);
    padding: 80px 60px 100px;
    font-family: 'Barlow Condensed', sans-serif;
    color: var(--white);
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    --mx: 0px;
    --my: 0px;
  }

  /* === BACKGROUND EFFECTS === */
  .cs-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(240,237,232,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(240,237,232,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
    transform: translate(calc(var(--mx) * -0.35), calc(var(--my) * -0.35));
  }

  .cs-bg-stripe {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--red), transparent);
    animation: stripe-scan 4s ease-in-out infinite;
  }

  @keyframes stripe-scan {
    0%, 100% { opacity: 0.3; transform: scaleX(0.3); }
    50% { opacity: 1; transform: scaleX(1); }
  }

  .cs-noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }

  .cs-glow {
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(12px);
    z-index: 0;
    transition: transform 1s cubic-bezier(0.16,1,0.3,1);
  }

  .cs-glow-1 {
    top: -120px;
    right: -120px;
    background: radial-gradient(circle, rgba(232,0,45,0.2), rgba(232,0,45,0.04) 45%, transparent 72%);
    transform: translate(calc(var(--mx) * -0.5), calc(var(--my) * -0.5));
    animation: breathe 7s ease-in-out infinite;
  }

  .cs-glow-2 {
    bottom: -190px;
    left: -90px;
    background: radial-gradient(circle, rgba(240,237,232,0.08), rgba(240,237,232,0.03) 45%, transparent 70%);
    transform: translate(calc(var(--mx) * 0.45), calc(var(--my) * 0.45));
    animation: breathe 9s ease-in-out infinite reverse;
  }

  .cs-scanline {
    position: absolute;
    left: 0;
    right: 0;
    height: 90px;
    background: linear-gradient(to bottom, transparent, rgba(232,0,45,0.06), transparent);
    pointer-events: none;
    z-index: 0;
    animation: sweep 9s linear infinite;
  }

  @keyframes breathe {
    0%, 100% { opacity: 0.45; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.08); }
  }

  @keyframes sweep {
    0% { transform: translateY(-130%); }
    100% { transform: translateY(140vh); }
  }

  /* === LABEL === */
  .cs-flag {
    width: 44px;
    height: 7px;
    margin-bottom: 18px;
    opacity: 0.2;
    transform: translateY(-10px);
    background-image: repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%);
    background-size: 7px 7px;
  }

  .cs-root.cs-visible .cs-flag { animation: fade-up 0.55s ease forwards 0.02s; }

  .cs-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    color: var(--red);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    position: relative;
    opacity: 0;
    transform: translateY(-10px);
  }

  .cs-root.cs-visible .cs-label { animation: fade-up 0.6s ease forwards 0.1s; }

  .cs-label-signal {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }

  .cs-label-ring {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid var(--red);
    animation: cs-pulse-ring 2s ease-out infinite;
  }

  .cs-label-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--red);
    animation: cs-blink 1.4s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes cs-pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  @keyframes cs-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.15; }
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 var(--red-glow); }
    50% { box-shadow: 0 0 0 6px transparent; }
  }

  @keyframes cs-glitch-clip-1 {
    0%, 100% { clip-path: inset(30% 0 50% 0); }
    25% { clip-path: inset(10% 0 60% 0); }
    50% { clip-path: inset(50% 0 20% 0); }
    75% { clip-path: inset(5% 0 80% 0); }
  }

  @keyframes cs-glitch-clip-2 {
    0%, 100% { clip-path: inset(60% 0 10% 0); }
    25% { clip-path: inset(80% 0 5% 0); }
    50% { clip-path: inset(20% 0 60% 0); }
    75% { clip-path: inset(40% 0 30% 0); }
  }

  @keyframes cs-glitch-x-1 {
    0%, 100% { transform: translateX(0); }
    33% { transform: translateX(-2px); }
    66% { transform: translateX(2px); }
  }

  @keyframes cs-glitch-x-2 {
    0%, 100% { transform: translateX(0); }
    33% { transform: translateX(2px); }
    66% { transform: translateX(-2px); }
  }

  /* === GRID === */
  .cs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    position: relative;
    z-index: 1;
  }

  /* === LEFT SIDE === */
  .cs-left { display: flex; flex-direction: column; gap: 32px; }

  .cs-headline {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-style: italic;
    font-size: clamp(3.5rem, 9vw, 8rem);
    line-height: 1.05;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--white);
    opacity: 0;
    transform: translateY(30px);
  }

  .cs-root.cs-visible .cs-headline { animation: fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards 0.25s; }

  .cs-headline-intro {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: clamp(11px, 1.2vw, 14px);
    letter-spacing: 0.22em;
    color: var(--off-white);
    margin-bottom: 14px;
    line-height: 1;
  }

  .cs-glitch-active::before,
  .cs-glitch-active::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .cs-glitch-active::before {
    color: var(--red);
    opacity: 0.75;
    animation: cs-glitch-clip-1 .15s steps(1) both, cs-glitch-x-1 .15s steps(1) both;
  }

  .cs-glitch-active::after {
    color: #8ed0ff;
    opacity: 0.5;
    animation: cs-glitch-clip-2 .15s steps(1) both, cs-glitch-x-2 .15s steps(1) both;
  }

  .cs-headline .cs-red { color: var(--red); position: relative; display: inline-block; line-height: 1; }

  .cs-headline .cs-red::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--red), rgba(232,0,45,0.25));
    transform: scaleX(0);
    transform-origin: left;
    animation: none;
    display: block;
  }

  .cs-root.cs-visible .cs-headline .cs-red::after { animation: underline-in 0.5s ease forwards 1.1s; }

  @keyframes underline-in { to { transform: scaleX(1); } }

  .cs-desc {
    font-size: 15px;
    font-weight: 300;
    color: var(--off-white);
    line-height: 1.7;
    max-width: 340px;
    letter-spacing: 0.03em;
    opacity: 0;
  }

  .cs-root.cs-visible .cs-desc { animation: fade-up 0.6s ease forwards 0.5s; }

  /* === RADIO LINKS === */
  .cs-links {
    display: flex;
    flex-direction: column;
    gap: 2px;
    opacity: 0;
    transform: translateX(-22px);
    pointer-events: none;
  }

  .cs-root.cs-visible .cs-links {
    animation: fade-left 0.65s cubic-bezier(0.16,1,0.3,1) forwards 0.62s;
    pointer-events: auto;
  }

  .cs-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border: 1px solid var(--border);
    text-decoration: none;
    color: var(--white);
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s;
    opacity: 0;
    transform: translateY(12px);
  }

  .cs-root.cs-visible .cs-link { animation: fade-up 0.5s ease forwards; }

  .cs-link:nth-child(1) { animation-delay: 0.78s; }
  .cs-link:nth-child(2) { animation-delay: 0.9s; }
  .cs-link:nth-child(3) { animation-delay: 1.02s; }

  .cs-link::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: var(--red);
    transform: scaleY(0);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    transform-origin: bottom;
  }

  .cs-link::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--red-dim), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .cs-link:hover,
  .cs-link.cs-link-hot {
    border-color: var(--border-active);
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(0,0,0,0.35);
  }
  .cs-link:hover::before { transform: scaleY(1); }
  .cs-link:hover::after { opacity: 1; }
  .cs-link.cs-link-hot::before { transform: scaleY(1); }
  .cs-link.cs-link-hot::after { opacity: 1; }
  .cs-link:hover .cs-link-arrow { transform: translate(3px, -3px); color: var(--red); }
  .cs-link:hover .cs-link-val { color: var(--white); }
  .cs-link.cs-link-hot .cs-link-arrow { transform: translate(3px, -3px); color: var(--red); }
  .cs-link.cs-link-hot .cs-link-val { color: var(--white); }

  .cs-link-left { display: flex; align-items: center; gap: 14px; position: relative; z-index: 1; }

  .cs-link-icon-wrap {
    width: 32px; height: 32px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    background: var(--panel);
    color: var(--off-white);
    flex-shrink: 0;
    transition: border-color 0.3s, background 0.3s, color 0.3s;
  }

  .cs-link:hover .cs-link-icon-wrap {
    border-color: var(--border-active);
    background: var(--red-dim);
    color: var(--white);
  }

  .cs-link-icon-wrap svg { display: block; }

  .cs-link-lbl {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.15em;
    color: var(--mid);
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 3px;
  }

  .cs-link-val {
    font-size: 13px;
    font-weight: 400;
    color: var(--off-white);
    transition: color 0.3s;
    letter-spacing: 0.02em;
  }

  .cs-link-arrow { transition: transform 0.3s, color 0.3s; color: var(--mid); position: relative; z-index: 1; }

  /* === FORM === */
  .cs-form {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    opacity: 0;
    transform: translateX(20px);
  }

  .cs-root.cs-visible .cs-form { animation: fade-right 0.8s cubic-bezier(0.16,1,0.3,1) forwards 0.4s; }

  @keyframes fade-right { to { opacity: 1; transform: translateX(0); } }

  @keyframes fade-left { to { opacity: 1; transform: translateX(0); } }

  .cs-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-bottom: none;
    background: var(--panel);
  }

  .cs-form-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--mid);
    text-transform: uppercase;
  }

  .cs-form-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: var(--red);
    text-transform: uppercase;
  }

  .cs-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--red);
    animation: pulse-dot 1.5s ease infinite;
  }

  .cs-field {
    position: relative;
    border: 1px solid var(--border);
    border-bottom: none;
    background: var(--panel);
    transition: border-color 0.3s, background 0.3s;
  }

  .cs-field:focus-within,
  .cs-field.cs-active {
    border-color: var(--border-active);
    z-index: 1;
    background: rgba(20,18,16,0.95);
  }
  .cs-field:focus-within .cs-field-label { color: var(--red); }
  .cs-field.cs-active .cs-field-label { color: var(--red); }

  .cs-field-label {
    position: absolute;
    top: 10px; left: 16px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--mid);
    text-transform: uppercase;
    pointer-events: none;
    transition: color 0.3s, transform 0.3s, letter-spacing 0.3s;
  }

  .cs-field.cs-active .cs-field-label,
  .cs-field.cs-has-value .cs-field-label {
    transform: translateY(-2px);
    letter-spacing: 0.24em;
  }

  .cs-field input,
  .cs-field textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--white);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.03em;
    padding: 28px 16px 12px;
    resize: none;
    caret-color: var(--red);
  }

  .cs-field input::placeholder,
  .cs-field textarea::placeholder { color: transparent; }

  .cs-field textarea { min-height: 120px; }

  .cs-field-line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }

  .cs-field:focus-within .cs-field-line { transform: scaleX(1); }
  .cs-field.cs-active .cs-field-line { transform: scaleX(1); }

  .cs-form-footer {
    border: 1px solid var(--border);
    background: var(--panel);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .cs-char-count {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--mid);
    letter-spacing: 0.1em;
    transition: color 0.25s;
  }

  .cs-char-count.warn { color: #ff8a94; }

  .cs-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--red);
    color: var(--white);
    border: none;
    cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 13px 24px;
    position: relative;
    overflow: hidden;
    transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
    white-space: nowrap;
  }

  .cs-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.12);
    transform: translateX(-100%) skewX(-15deg);
    transition: transform 0.4s ease;
  }

  .cs-btn:hover::before { transform: translateX(150%) skewX(-15deg); }
  .cs-btn:hover { background: #ff0033; }
  .cs-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(232,0,45,0.35); }
  .cs-btn:active { transform: scale(0.98); }
  .cs-btn:disabled { opacity: 0.72; cursor: not-allowed; }

  .cs-btn .cs-btn-icon {
    transition: transform 0.3s;
    display: flex;
  }

  .cs-btn:hover .cs-btn-icon { transform: translate(3px, -3px); }

  /* === SENT STATE === */
  .cs-sent {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 20px;
    text-align: center;
    border: 1px solid var(--border-active);
    background: var(--panel);
    animation: fade-up 0.5s ease forwards;
  }

  .cs-sent-icon {
    width: 52px; height: 52px;
    border: 2px solid var(--red);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  @keyframes icon-pop { from { transform: scale(0); } to { transform: scale(1); } }

  .cs-sent-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    letter-spacing: 0.05em;
    color: var(--white);
  }

  .cs-sent-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--mid);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  /* === TELEMETRY BAR === */
  .cs-telemetry {
    position: absolute;
    bottom: 40px; left: 60px; right: 60px;
    display: flex;
    gap: 32px;
    border-top: 1px solid var(--border);
    padding-top: 20px;
    z-index: 1;
    opacity: 0;
    transform: translateY(10px);
  }

  .cs-root.cs-visible .cs-telemetry { animation: fade-up 0.6s ease forwards 1s; }

  .cs-tele-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    transform: translateY(12px);
  }

  .cs-root.cs-visible .cs-tele-item:nth-child(1) { animation: fade-up 0.45s ease forwards 1.05s; }
  .cs-root.cs-visible .cs-tele-item:nth-child(2) { animation: fade-up 0.45s ease forwards 1.15s; }
  .cs-root.cs-visible .cs-tele-item:nth-child(3) { animation: fade-up 0.45s ease forwards 1.25s; }
  .cs-root.cs-visible .cs-tele-item:nth-child(4) { animation: fade-up 0.45s ease forwards 1.35s; }

  .cs-tele-key {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--mid);
    text-transform: uppercase;
  }

  .cs-tele-val {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--off-white);
  }

  .cs-tele-val.live {
    color: var(--red);
    animation: blink 2s step-end infinite;
  }

  @keyframes blink { 50% { opacity: 0.4; } }

  /* === UTILS === */
  @keyframes fade-up {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .cs-root { padding: 48px 24px 80px; }
    .cs-grid { display: flex; flex-direction: column; gap: 16px; }
    .cs-left { display: contents; }
    .cs-headline { order: 1; }
    .cs-desc { order: 2; margin-bottom: 16px; }
    .cs-form { order: 3; }
    .cs-links { order: 4; margin-top: 16px; }
    .cs-telemetry {
      position: static;
      left: auto;
      right: auto;
      bottom: auto;
      margin-top: 34px;
      flex-wrap: wrap;
      gap: 20px;
      padding-top: 18px;
    }

    .cs-tele-item {
      min-width: 130px;
    }
  }
`

function GlitchText({ children, className = '' }) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 180)
    }, 3800 + Math.random() * 2600)

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`${className} ${glitching ? 'cs-glitch-active' : ''}`.trim()}
      style={{ position: 'relative', display: 'inline-block' }}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  )
}

export default function ContactSection() {
  const sectionRef = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' })
  const [focused, setFocused] = useState(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const msgLen = values.message.length

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMousePos({ x: mx, y: my })
    }

    const resetMouse = () => setMousePos({ x: 0, y: 0 })

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', resetMouse)

    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', resetMouse)
    }
  }, [])

  const links = [
    { icon: MailIcon, lbl: 'Email', val: 'sohamhipparkar09@gmail.com', href: 'mailto:sohamhipparkar09@gmail.com' },
    { icon: GitHubIcon, lbl: 'GitHub', val: 'github.com/sohamhipparkar', href: 'https://github.com/sohamhipparkar' },
    { icon: LinkedInIcon, lbl: 'LinkedIn', val: 'linkedin.com/in/soham-hipparkar', href: 'https://linkedin.com/in/soham-hipparkar' },
  ]

  const fields = [
    { key: 'name', type: 'text', label: 'Driver Name' },
    { key: 'email', type: 'email', label: 'Team Radio Frequency' },
    { key: 'subject', type: 'text', label: 'Subject' },
  ]

  function handleSend() {
    if (sending) return
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1600)
  }

  return (
    <>
      <style>{style}</style>
      <section
        id="contact"
        ref={sectionRef}
        className={`cs-root${visible ? ' cs-visible' : ''}`}
        style={{ '--mx': `${mousePos.x * 10}px`, '--my': `${mousePos.y * 10}px` }}
      >
        <div className="cs-bg-grid" />
        <div className="cs-bg-stripe" />
        <div className="cs-scanline" />
        <div className="cs-glow cs-glow-1" />
        <div className="cs-glow cs-glow-2" />
        <div className="cs-noise" />

        <div className="cs-flag" />

        <div className="cs-label">
          <span className="cs-label-signal">
            <span className="cs-label-ring" />
            <span className="cs-label-dot" />
          </span>
          <span>Sector 06 - Team Radio</span>
        </div>

        <div className="cs-grid">
          {/* LEFT */}
          <div className="cs-left">
            <h2 className="cs-headline">
              <GlitchText>Ready to build</GlitchText><br /><span className="cs-red">something</span> fast?
            </h2>
            <p className="cs-desc">
              Open to new projects, collaborations, and opportunities. Drop me a message — I respond quickly. Always.
            </p>
            <div className="cs-links">
              {links.map(({ icon: Icon, lbl, val, href }) => (
                <a
                  key={lbl}
                  href={href}
                  className={`cs-link${hoveredLink === lbl ? ' cs-link-hot' : ''}`}
                  onMouseEnter={() => setHoveredLink(lbl)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className="cs-link-left">
                    <div className="cs-link-icon-wrap">
                      <Icon />
                    </div>
                    <div>
                      <div className="cs-link-lbl">{lbl}</div>
                      <div className="cs-link-val">{val}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="cs-link-arrow" />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="cs-form">
            {sent ? (
              <div className="cs-sent">
                <div className="cs-sent-icon">
                  <Radio size={22} color="var(--red)" />
                </div>
                <div className="cs-sent-title">Transmission Sent</div>
                <div className="cs-sent-sub">Signal received — I'll be in touch shortly</div>
              </div>
            ) : (
              <>
                <div className="cs-form-header">
                  <span className="cs-form-title">Pit Wall Form</span>
                  <span className="cs-form-status">
                    <span className="cs-status-dot" />
                    {sending ? 'Transmitting...' : 'Channel Open'}
                  </span>
                </div>

                {fields.map(({ key, type, label }) => (
                  <div key={key} className={`cs-field${focused === key ? ' cs-active' : ''}${values[key] ? ' cs-has-value' : ''}`}>
                    <span className="cs-field-label">{label}</span>
                    <input
                      type={type}
                      value={values[key]}
                      placeholder={label}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                    <div className="cs-field-line" />
                  </div>
                ))}

                <div className={`cs-field${focused === 'message' ? ' cs-active' : ''}${values.message ? ' cs-has-value' : ''}`}>
                  <span className="cs-field-label">Your Message</span>
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    maxLength={500}
                    value={values.message}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    onChange={e => setValues(v => ({ ...v, message: e.target.value }))}
                  />
                  <div className="cs-field-line" />
                </div>

                <div className="cs-form-footer">
                  <span className={`cs-char-count${msgLen > 450 ? ' warn' : ''}`}>{String(msgLen).padStart(3, '0')} / 500 CHARS</span>
                  <button className="cs-btn" onClick={handleSend} disabled={sending}>
                    {sending ? 'Transmitting' : 'Send Transmission'}
                    <span className="cs-btn-icon"><ArrowUpRight size={13} /></span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <br />

        {/* TELEMETRY BAR */}
        <div className="cs-telemetry">
          {[
            { k: 'STATUS', v: 'AVAILABLE', live: true },
            { k: 'RESPONSE TIME', v: '< 24H' },
            { k: 'LOCATION', v: 'PUNE, IN' },
            { k: 'TIMEZONE', v: 'IST +05:30' },
          ].map(({ k, v, live }) => (
            <div key={k} className="cs-tele-item">
              <span className="cs-tele-key">{k}</span>
              <span className={`cs-tele-val${live ? ' live' : ''}`}>{v}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}