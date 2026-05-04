import { useState, useEffect, useRef } from 'react'

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --red:      #E8002D;
      --red-dim:  #9B001E;
      --red-glow: rgba(232,0,45,0.18);
      --ink:      #0b0b0b;
      --ink2:     #111111;
      --carbon:   #141414;
      --silver:   #c8c8c8;
      --silver2:  #888;
      --silver3:  #444;
      --rule:     rgba(255,255,255,0.07);
      --rule2:    rgba(255,255,255,0.13);
    }

    html { scroll-behavior: smooth; }
    body { background: var(--ink); color: var(--silver); font-family: 'Barlow', sans-serif; }

    .carbon-bg {
      background-color: var(--ink);
      background-image:
        repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 6px),
        repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 6px);
    }

    .grain::after {
      content: '';
      position: fixed; inset: -200%; width: 400%; height: 400%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.022; pointer-events: none; z-index: 9999;
      animation: gs 0.35s steps(1) infinite;
    }
    @keyframes gs {
      0%   { transform: translate(0,0); }   25%  { transform: translate(-1%,-1%); }
      50%  { transform: translate(1%,0); }  75%  { transform: translate(0,1%); }
    }

    .progress-bar {
      position: fixed; top: 0; left: 0; height: 3px;
      background: linear-gradient(90deg, var(--red-dim), var(--red));
      z-index: 300; transition: width 0.1s linear;
      box-shadow: 0 0 12px var(--red-glow);
    }

    .launch-overlay {
      position: fixed;
      inset: 0;
      z-index: 260;
      pointer-events: none;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 50% 52%, rgba(232,0,45,0.12) 0%, transparent 38%),
        radial-gradient(circle at 18% 50%, rgba(56,189,248,0.08) 0%, transparent 22%),
        radial-gradient(circle at 82% 50%, rgba(255,176,0,0.06) 0%, transparent 24%),
        linear-gradient(180deg, rgba(8,8,8,0.12) 0%, rgba(8,8,8,0.78) 100%);
      animation: launch-overlay-in 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay::before,
    .launch-overlay::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .launch-overlay::before {
      background-image:
        linear-gradient(120deg, transparent 0 39%, rgba(255,255,255,0.11) 43%, transparent 47%),
        linear-gradient(120deg, transparent 0 56%, rgba(232,0,45,0.18) 61%, transparent 68%),
        repeating-linear-gradient(90deg, transparent 0 58px, rgba(255,255,255,0.04) 58px 60px, transparent 60px 120px);
      background-size: 160% 100%;
      transform: translateX(-18%);
      animation: launch-streak 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
      mix-blend-mode: screen;
    }

    .launch-overlay::after {
      background:
        linear-gradient(90deg, transparent 0 9%, rgba(255,255,255,0.05) 9.5% 10%, transparent 10.5% 28%, rgba(232,0,45,0.08) 28.5% 29.5%, transparent 30% 70%, rgba(255,255,255,0.06) 70.5% 71.5%, transparent 72% 100%),
        repeating-linear-gradient(0deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 13px);
      opacity: 0.62;
      animation: launch-grid 0.96s ease-out both;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.18), black 18%, black 82%, rgba(0,0,0,0.18));
    }

    .launch-overlay__core {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      gap: 16px;
      text-align: center;
      transform: translateY(8px);
    }

    .launch-overlay__signal-row {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      animation: launch-signal-row 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__signal {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      box-shadow: 0 0 0 rgba(232,0,45,0);
      animation: launch-signal 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__signal:nth-child(1) { animation-delay: 0.02s; }
    .launch-overlay__signal:nth-child(2) { animation-delay: 0.08s; }
    .launch-overlay__signal:nth-child(3) { animation-delay: 0.14s; }
    .launch-overlay__signal:nth-child(4) { animation-delay: 0.20s; }
    .launch-overlay__signal:nth-child(5) { animation-delay: 0.26s; }

    .launch-overlay__badge {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.72);
      background: rgba(11,11,11,0.58);
      border: 1px solid rgba(232,0,45,0.2);
      padding: 10px 16px;
      clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
      box-shadow: 0 0 24px rgba(232,0,45,0.12);
      animation: launch-badge 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(2.6rem, 7vw, 5.8rem);
      font-weight: 900;
      font-style: italic;
      letter-spacing: -0.04em;
      line-height: 0.92;
      text-transform: uppercase;
      color: #fff;
      text-shadow: 0 0 24px rgba(232,0,45,0.28);
      animation: launch-title 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__title span {
      color: var(--red);
    }

    .launch-overlay__sub {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.56);
      animation: launch-sub 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__pulse {
      position: absolute;
      left: 50%;
      top: 50%;
      width: min(58vw, 640px);
      height: min(58vw, 640px);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0.35);
      background: radial-gradient(circle, rgba(232,0,45,0.24) 0%, rgba(232,0,45,0.08) 30%, transparent 68%);
      filter: blur(10px);
      opacity: 0;
      animation: launch-pulse 0.96s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .launch-overlay__rails {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, transparent 0 15%, rgba(255,255,255,0.03) 15% 15.5%, transparent 15.5% 84.5%, rgba(255,255,255,0.03) 84.5% 85%, transparent 85% 100%),
        linear-gradient(180deg, transparent 0 48%, rgba(232,0,45,0.15) 48.5% 49%, transparent 49.5% 100%);
      opacity: 0;
      animation: launch-rails 0.96s ease-out both;
    }

    .launch-overlay__track {
      position: absolute;
      left: -12%;
      right: -12%;
      top: 50%;
      height: 2px;
      margin-top: 44px;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 14%, rgba(232,0,45,0.7) 50%, rgba(255,255,255,0.05) 86%, transparent 100%);
      box-shadow: 0 0 16px rgba(232,0,45,0.28);
      transform-origin: center;
      animation: launch-track 0.88s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes launch-overlay-in {
      0%   { opacity: 0; }
      10%  { opacity: 1; }
      74%  { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes launch-streak {
      0%   { opacity: 0; transform: translateX(-26%) skewX(-16deg); }
      18%  { opacity: 1; }
      72%  { opacity: 1; }
      100% { opacity: 0; transform: translateX(26%) skewX(-16deg); }
    }

    @keyframes launch-grid {
      0%   { opacity: 0; transform: scale(1.02); }
      20%  { opacity: 0.7; }
      100% { opacity: 0; transform: scale(1.08); }
    }

    @keyframes launch-badge {
      0%   { opacity: 0; transform: translateY(18px) scale(0.92); filter: blur(2px); }
      20%  { opacity: 1; }
      78%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-16px) scale(1); filter: blur(0); }
    }

    @keyframes launch-title {
      0%   { opacity: 0; transform: translateY(20px) skewX(-7deg); letter-spacing: -0.08em; }
      18%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-14px) skewX(0deg); letter-spacing: -0.04em; }
    }

    @keyframes launch-sub {
      0%   { opacity: 0; transform: translateY(12px); }
      22%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-10px); }
    }

    @keyframes launch-pulse {
      0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.25); }
      18%  { opacity: 0.85; }
      60%  { opacity: 0.22; transform: translate(-50%, -50%) scale(0.85); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.08); }
    }

    @keyframes launch-track {
      0%   { transform: scaleX(0.2); opacity: 0; }
      16%  { transform: scaleX(1); opacity: 1; }
      70%  { transform: scaleX(1); opacity: 0.9; }
      100% { transform: scaleX(1.2); opacity: 0; }
    }

    @keyframes launch-signal-row {
      0% { opacity: 0; transform: translateY(10px); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: translateY(-8px); }
    }

    @keyframes launch-signal {
      0% { opacity: 0; transform: scale(0.35); }
      20% { opacity: 1; transform: scale(1); background: rgba(232,0,45,0.88); box-shadow: 0 0 16px rgba(232,0,45,0.34); }
      70% { opacity: 1; transform: scale(1.12); }
      100% { opacity: 0; transform: scale(0.9); }
    }

    @keyframes launch-rails {
      0% { opacity: 0; transform: scaleX(0.9); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: scaleX(1.03); }
    }

    @media (prefers-reduced-motion: reduce) {
      .launch-overlay,
      .launch-overlay::before,
      .launch-overlay::after,
      .launch-overlay__core,
      .launch-overlay__rails,
      .launch-overlay__signal-row,
      .launch-overlay__signal,
      .launch-overlay__badge,
      .launch-overlay__title,
      .launch-overlay__sub,
      .launch-overlay__pulse,
      .launch-overlay__track {
        animation: none !important;
      }
    }

    /* NAV */
    .f1-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 48px; height: 60px;
      transition: background 0.3s, border-color 0.3s;
    }
    .f1-nav.scrolled {
      background: rgba(11,11,11,0.95); border-bottom: 1px solid var(--rule2);
      backdrop-filter: blur(12px);
    }
    .nav-logo { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 1.3rem; letter-spacing: 0.04em; text-transform: uppercase; color: #fff; }
    .nav-logo .dot { color: var(--red); }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--silver2); text-decoration: none; transition: color 0.2s; }
    .nav-links a:hover { color: var(--red); }
    .nav-pit { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; background: var(--red); color: #fff; border: none; cursor: pointer; padding: 9px 20px; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); transition: background 0.2s; }
    .nav-pit:hover { background: #ff1a3c; }

    /* HERO */
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 48px 60px; position: relative; overflow: hidden; }
    .hero-stripe { position: absolute; top: 0; right: 0; width: 3px; height: 100%; background: linear-gradient(to bottom, transparent, var(--red) 30%, var(--red) 70%, transparent); opacity: 0.6; }
    .hero-grid-lines { position: absolute; inset: 0; background-image: linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%); pointer-events: none; }
    .hero-red-glow { position: absolute; bottom: -80px; left: -80px; width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(232,0,45,0.09) 0%, transparent 70%); pointer-events: none; }
    .hero-driver-num { position: absolute; right: 72px; top: 50%; transform: translateY(-60%); font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: clamp(10rem, 22vw, 22rem); color: rgba(255,255,255,0.025); line-height: 1; user-select: none; pointer-events: none; letter-spacing: -0.04em; }
    .hero-sector { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    .sector-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); animation: blink 1.4s ease-in-out infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
    .hero-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic; font-size: clamp(5rem, 14vw, 12rem); line-height: 0.88; letter-spacing: -0.01em; text-transform: uppercase; color: #fff; margin-bottom: 20px; }
    .hero-name .red { color: var(--red); }
    .hero-telemetry { display: flex; gap: 32px; margin-bottom: 48px; padding: 16px 0; border-top: 1px solid var(--rule2); }
    .telem-item { display: flex; flex-direction: column; gap: 4px; }
    .telem-label { font-family: 'Share Tech Mono', monospace; font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--silver3); }
    .telem-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 1.1rem; color: var(--silver); }
    .telem-val.green { color: #39d353; }
    .hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
    .hero-desc { font-size: 0.95rem; line-height: 1.75; color: var(--silver2); max-width: 420px; }
    .hero-desc strong { color: var(--silver); font-weight: 500; }
    .hero-actions { display: flex; gap: 12px; flex-shrink: 0; }
    .btn-f1 { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 14px 28px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%); transition: all 0.2s; }
    .btn-f1.primary { background: var(--red); color: #fff; }
    .btn-f1.primary:hover { background: #ff1a3c; transform: translateY(-1px); }
    .btn-f1.ghost { background: transparent; color: var(--silver); clip-path: none; border: 1px solid var(--rule2); }
    .btn-f1.ghost:hover { border-color: var(--red); color: var(--red); transform: translateY(-1px); }
    .checker-accent { width: 48px; height: 8px; background-image: repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%); background-size: 8px 8px; opacity: 0.18; margin-bottom: 20px; }

    /* DIVIDERS */
    .divider { height: 1px; margin: 0 48px; background: linear-gradient(90deg, transparent, var(--rule2) 20%, var(--rule2) 80%, transparent); }
    .divider-red { height: 1px; background: linear-gradient(90deg, var(--red-dim) 0%, transparent 60%); }

    /* SECTIONS */
    .section { padding: 100px 48px; position: relative; }
    .sec-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.24em; text-transform: uppercase; color: var(--red); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
    .sec-label::after { content: ''; height: 1px; width: 48px; background: var(--red-dim); }
    .sec-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic; font-size: clamp(2.8rem, 6vw, 5rem); text-transform: uppercase; color: #fff; line-height: 0.95; letter-spacing: -0.01em; margin-bottom: 60px; }

    /* ABOUT */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
    .about-text { font-size: 0.95rem; line-height: 1.8; color: var(--silver2); margin-bottom: 28px; }
    .about-text strong { color: var(--silver); font-weight: 500; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
    .chip { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; color: var(--silver2); border: 1px solid var(--silver3); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); transition: border-color 0.2s, color 0.2s; }
    .chip:hover { border-color: var(--red); color: var(--red); }
    .spec-card { border: 1px solid var(--rule2); background: var(--carbon); overflow: hidden; }
    .spec-header { background: var(--red); padding: 12px 24px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; }
    .spec-row { padding: 20px 24px; border-bottom: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
    .spec-row:last-child { border-bottom: none; }
    .spec-row:hover { background: rgba(232,0,45,0.04); }
    .spec-key { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--silver3); }
    .spec-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 0.9rem; color: var(--silver); text-align: right; }

    /* WORK */
    .stint { display: grid; grid-template-columns: 140px 1fr 24px; gap: 40px; padding: 36px 0; border-bottom: 1px solid var(--rule); position: relative; }
    .stint:first-child { border-top: 1px solid var(--rule); }
    .stint::before { content: ''; position: absolute; left: -48px; top: 0; bottom: 0; width: 3px; background: var(--red); transform: scaleY(0); transform-origin: top; transition: transform 0.3s; }
    .stint:hover::before { transform: scaleY(1); }
    .stint-period { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.14em; color: var(--silver3); padding-top: 4px; text-transform: uppercase; }
    .stint-team { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-style: italic; font-size: 1.6rem; text-transform: uppercase; color: #fff; margin-bottom: 4px; transition: color 0.2s; }
    .stint:hover .stint-team { color: var(--red); }
    .stint-role { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); margin-bottom: 14px; }
    .stint-desc { font-size: 0.88rem; line-height: 1.7; color: var(--silver2); max-width: 540px; }
    .stint-arrow { color: var(--silver3); opacity: 0; transition: opacity 0.2s, transform 0.2s; padding-top: 4px; }
    .stint:hover .stint-arrow { opacity: 1; transform: translate(2px,-2px); color: var(--red); }

    /* PROJECTS */
    .proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
    .proj-card { background: var(--carbon); border: 1px solid var(--rule); padding: 40px 36px; position: relative; overflow: hidden; transition: border-color 0.25s, background 0.25s; }
    .proj-card:hover { border-color: var(--red); background: rgba(232,0,45,0.03); }
    .proj-card:hover .proj-arrow { opacity: 1; transform: translate(2px,-2px); color: var(--red); }
    .proj-card:hover .proj-num { color: rgba(232,0,45,0.25); }
    .proj-card-wide { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--rule); background: var(--carbon); overflow: hidden; transition: border-color 0.25s; }
    .proj-card-wide:hover { border-color: var(--red); }
    .proj-card-wide:hover .proj-arrow { opacity: 1; transform: translate(2px,-2px); color: var(--red); }
    .proj-card-wide:hover .proj-num { color: rgba(232,0,45,0.25); }
    .proj-wide-left { padding: 40px 36px; border-right: 1px solid var(--rule); }
    .proj-wide-right { padding: 40px 36px; display: flex; flex-direction: column; justify-content: flex-end; }
    .proj-num { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 3.5rem; color: rgba(255,255,255,0.06); line-height: 1; margin-bottom: 20px; transition: color 0.25s; }
    .proj-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-style: italic; font-size: 1.55rem; text-transform: uppercase; color: #fff; margin-bottom: 12px; }
    .proj-desc { font-size: 0.85rem; line-height: 1.7; color: var(--silver2); margin-bottom: 24px; }
    .proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
    .proj-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--silver3); border: 1px solid var(--silver3); padding: 3px 9px; clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%); }
    .proj-link { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--silver2); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: color 0.2s; }
    .proj-link:hover { color: var(--red); }
    .proj-arrow { opacity: 0; transition: opacity 0.2s, transform 0.2s; }

    /* CONTACT */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
    .contact-big { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic; font-size: clamp(2.5rem, 6vw, 4rem); text-transform: uppercase; color: #fff; line-height: 0.95; margin-bottom: 28px; }
    .contact-big .red { color: var(--red); }
    .contact-desc { font-size: 0.9rem; line-height: 1.8; color: var(--silver2); margin-bottom: 36px; }
    .radio-links { display: flex; flex-direction: column; }
    .radio-link { display: flex; align-items: center; justify-content: space-between; padding: 18px 0; border-bottom: 1px solid var(--rule); text-decoration: none; color: var(--silver); transition: color 0.2s; }
    .radio-link:first-child { border-top: 1px solid var(--rule); }
    .radio-link:hover { color: var(--red); }
    .radio-link:hover .radio-arrow { opacity: 1; transform: translate(2px,-2px); }
    .radio-left { display: flex; align-items: center; gap: 14px; }
    .radio-lbl { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--silver3); }
    .radio-val { font-size: 0.9rem; }
    .radio-arrow { opacity: 0; transition: opacity 0.2s, transform 0.2s; }
    .pit-form { display: flex; flex-direction: column; }
    .pit-field { border-bottom: 1px solid var(--rule); position: relative; }
    .pit-field:first-child { border-top: 1px solid var(--rule); }
    .pit-field::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px; background: var(--red); transform: scaleX(0); transition: transform 0.3s; transform-origin: left; }
    .pit-field:focus-within::after { transform: scaleX(1); }
    .pit-field input, .pit-field textarea { width: 100%; background: transparent; border: none; outline: none; padding: 18px 0; color: var(--silver); font-family: 'Barlow', sans-serif; font-size: 0.9rem; resize: none; }
    .pit-field input::placeholder, .pit-field textarea::placeholder { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--silver3); }
    .pit-submit { margin-top: 28px; }

    /* FOOTER */
    .f1-footer { padding: 28px 48px; border-top: 1px solid var(--rule); display: flex; align-items: center; justify-content: space-between; }
    .footer-copy { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; color: var(--silver3); }
    .footer-copy .red { color: var(--red); }
    .footer-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; color: var(--silver3); }

    /* SIDE */
    .side-socials { position: fixed; left: 20px; bottom: 48px; display: flex; flex-direction: column; align-items: center; gap: 14px; z-index: 100; }
    .side-socials::before { content: ''; width: 1px; height: 56px; background: linear-gradient(to bottom, transparent, var(--rule2)); }
    .side-link { color: var(--silver3); transition: color 0.2s, transform 0.2s; display: flex; }
    .side-link:hover { color: var(--red); transform: translateX(2px); }
    .avail-tag { position: fixed; right: 20px; bottom: 48px; font-family: 'Share Tech Mono', monospace; font-size: 0.56rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--silver3); writing-mode: vertical-rl; display: flex; align-items: center; gap: 8px; z-index: 100; }
    .avail-tag::after { content: ''; width: 1px; height: 56px; background: linear-gradient(to bottom, var(--rule2), transparent); }
    .avail-dot { width: 5px; height: 5px; border-radius: 50%; background: #39d353; animation: blink 1.4s ease-in-out infinite; }

    /* ANIMATIONS */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    .fu { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
    .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.15s; }
    .d3 { animation-delay: 0.28s; } .d4 { animation-delay: 0.44s; }

    /* TECH STACK SECTION */
    .ts-categories {
      display: flex; gap: 8px; flex-wrap: wrap;
      margin-bottom: 48px;
    }
    .ts-filter-btn {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem; letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 7px 16px; border: 1px solid var(--silver3);
      background: transparent; color: var(--silver3);
      cursor: pointer;
      clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
      transition: all 0.2s;
    }
    .ts-filter-btn:hover { border-color: var(--red); color: var(--red); }
    .ts-filter-btn.active {
      background: var(--red); color: #fff;
      border-color: var(--red);
    }
    .ts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 2px;
    }
    .ts-card {
      background: var(--carbon);
      border: 1px solid var(--rule);
      padding: 24px 16px;
      display: flex; flex-direction: column;
      align-items: center; gap: 12px;
      cursor: default;
      position: relative; overflow: hidden;
      transition: border-color 0.25s, background 0.25s, transform 0.2s;
    }
    .ts-card::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(232,0,45,0.05) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.25s;
    }
    .ts-card:hover {
      border-color: var(--red);
      background: rgba(232,0,45,0.04);
      transform: translateY(-2px);
    }
    .ts-card:hover::before { opacity: 1; }
    .ts-card:hover .ts-name { color: #fff; }
    .ts-card:hover .ts-icon { transform: scale(1.12); }
    .ts-icon {
      width: 40px; height: 40px;
      object-fit: contain;
      transition: transform 0.25s;
      position: relative; z-index: 1;
    }
    .ts-name {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.6rem; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--silver3);
      text-align: center;
      transition: color 0.25s;
      position: relative; z-index: 1;
    }
    .ts-card[data-cat="frontend"]:hover { border-color: #38bdf8; background: rgba(56,189,248,0.04); }
    .ts-card[data-cat="frontend"]:hover .ts-name { color: #38bdf8; }
    .ts-card[data-cat="backend"]:hover  { border-color: #34d399; background: rgba(52,211,153,0.04); }
    .ts-card[data-cat="backend"]:hover  .ts-name { color: #34d399; }
    .ts-card[data-cat="database"]:hover { border-color: #fbbf24; background: rgba(251,191,36,0.04); }
    .ts-card[data-cat="database"]:hover .ts-name { color: #fbbf24; }
    .ts-card[data-cat="tools"]:hover    { border-color: #a78bfa; background: rgba(167,139,250,0.04); }
    .ts-card[data-cat="tools"]:hover    .ts-name { color: #a78bfa; }
    .ts-section-bottom {
      display: flex; align-items: center;
      justify-content: space-between;
      margin-top: 32px; padding-top: 20px;
      border-top: 1px solid var(--rule);
    }
    .ts-count {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--silver3);
    }
    .ts-count span { color: var(--red); }
    .ts-legend {
      display: flex; gap: 20px;
    }
    .ts-legend-item {
      display: flex; align-items: center; gap: 6px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.55rem; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--silver3);
    }
    .ts-legend-dot {
      width: 6px; height: 6px; border-radius: 50%;
    }

    /* TIMELINE WORK */
    .tl-wrapper {
      position: relative;
      padding-left: 48px;
    }
    .tl-wrapper::before {
      content: '';
      position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px;
      background: linear-gradient(to bottom, var(--red), var(--red-dim) 70%, transparent);
    }
    .tl-item {
      position: relative;
      margin-bottom: 0;
      padding: 0 0 56px 0;
      opacity: 1;
    }
    .tl-item:last-child { padding-bottom: 0; }
    .tl-node {
      position: absolute;
      left: -57px; top: 6px;
      width: 18px; height: 18px;
      border: 2px solid var(--red);
      background: var(--ink);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.2s;
      clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
    }
    .tl-item:hover .tl-node {
      background: var(--red);
      transform: scale(1.2);
    }
    .tl-node-inner {
      width: 6px; height: 6px;
      background: var(--red);
      clip-path: polygon(2px 0%, 100% 0%, calc(100% - 2px) 100%, 0% 100%);
      transition: background 0.2s;
    }
    .tl-item:hover .tl-node-inner { background: #fff; }
    .tl-tick {
      position: absolute;
      left: -48px; top: 14px;
      width: 48px; height: 1px;
      background: linear-gradient(to right, transparent, var(--silver3));
      opacity: 0; transition: opacity 0.2s;
    }
    .tl-item:hover .tl-tick { opacity: 1; }
    .tl-header {
      display: flex; align-items: flex-start;
      justify-content: space-between; gap: 24px;
      margin-bottom: 8px;
    }
    .tl-meta { flex: 1; }
    .tl-company {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 900; font-style: italic;
      font-size: 1.8rem; text-transform: uppercase;
      color: #fff; line-height: 1;
      margin-bottom: 4px;
      transition: color 0.2s;
    }
    .tl-item:hover .tl-company { color: var(--red); }
    .tl-role {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.62rem; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--red);
      margin-bottom: 2px;
    }
    .tl-period-badge {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.58rem; letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 5px 14px;
      border: 1px solid var(--silver3); color: var(--silver3);
      white-space: nowrap; flex-shrink: 0;
      clip-path: polygon(7px 0%, 100% 0%, calc(100% - 7px) 100%, 0% 100%);
      transition: border-color 0.2s, color 0.2s;
      align-self: flex-start; margin-top: 4px;
    }
    .tl-item:hover .tl-period-badge { border-color: var(--red); color: var(--red); }
    .tl-desc {
      font-size: 0.9rem; line-height: 1.75;
      color: var(--silver2); max-width: 600px;
      margin-bottom: 16px; margin-top: 10px;
    }
    .tl-achievements {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-bottom: 16px;
    }
    .tl-pill {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.56rem; letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      background: rgba(232,0,45,0.08);
      border: 1px solid rgba(232,0,45,0.2);
      color: rgba(232,0,45,0.7);
      clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
    }
    .tl-tech-row {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .tl-tech-tag {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.56rem; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--silver3);
      border: 1px solid var(--silver3);
      padding: 3px 9px;
      clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
      transition: border-color 0.2s, color 0.2s;
    }
    .tl-item:hover .tl-tech-tag { border-color: rgba(232,0,45,0.3); color: var(--silver2); }
    .tl-separator {
      position: absolute;
      left: 0; right: 0;
      bottom: 28px;
      height: 1px;
      background: linear-gradient(90deg, var(--rule2) 0%, transparent 100%);
    }
    .tl-item:last-child .tl-separator { display: none; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .f1-nav { padding: 0 20px; } .nav-links { display: none; }
      .hero { padding: 0 20px 48px; } .section { padding: 72px 20px; }
      .divider { margin: 0 20px; }
      .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 48px; }
      .proj-grid { grid-template-columns: 1fr; }
      .proj-card-wide { grid-column: auto; grid-template-columns: 1fr; }
      .proj-wide-left { border-right: none; border-bottom: 1px solid var(--rule); }
      .stint { grid-template-columns: 1fr; gap: 8px; } .stint::before { left: -20px; }
      .f1-footer { flex-direction: column; gap: 10px; }
      .side-socials, .avail-tag, .hero-driver-num { display: none; }
      .tl-wrapper { padding-left: 32px; }
      .tl-node { left: -41px; }
      .tl-header { flex-direction: column; gap: 8px; }
      .ts-grid { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }
      .ts-legend { display: none; }
    }
  `}</style>
)

export default function MainPortfolioPage({
  renderNav,
  renderHero,
  aboutSection,
  workTimelineSection,
  techStackSection,
  projectsSection,
  contactSection,
  footerSection,
  sideElements,
}) {
  const [scrollY, setScrollY] = useState(0)
  const [pct, setPct] = useState(0)
  const [jumpTransition, setJumpTransition] = useState(null)
  const transitionTimerRef = useRef(null)
  const resumeLink = 'https://drive.google.com/file/d/16L3bG9SRe935JUk7urKlawEmpDGsfmcX/view?usp=sharing'
  const sectionOrder = ['home', 'about', 'work', 'tech', 'projects']
  const transitionLabels = {
    home: 'PIT RETURN',
    about: 'SECTOR 02',
    work: 'SECTOR 03',
    tech: 'SECTOR 04',
    projects: 'SECTOR 05',
    contact: 'FINAL STOP',
  }
  const transitionSubtitles = {
    home: 'BOX LANE • RESET THE LAP',
    about: 'SECTOR 02 • BUILDING THE RACE',
    work: 'SECTOR 03 • TEAM STRATEGY ACTIVE',
    tech: 'SECTOR 04 • TECHNICAL SPECS',
    projects: 'SECTOR 05 • PUSHING THE PACE',
    contact: 'CHECKERED FLAG • END OF RUN',
  }

  useEffect(() => {
    const fn = () => {
      setScrollY(window.scrollY)
      setPct((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
  }, [])

  const go = (id) => {
    const el = document.getElementById(id)
    if (!el) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const targetIndex = sectionOrder.indexOf(id)
    const currentIndex = sectionOrder.reduce((closest, sectionId, index) => {
      const sectionEl = document.getElementById(sectionId)
      if (!sectionEl) return closest
      const top = sectionEl.getBoundingClientRect().top
      return Math.abs(top) < Math.abs(closest.distance) ? { index, distance: top } : closest
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    setJumpTransition({ id, direction: targetIndex >= currentIndex ? 'forward' : 'reverse', label: transitionLabels[id] || 'SECTOR 04' })

    if (reduceMotion) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      transitionTimerRef.current = setTimeout(() => setJumpTransition(null), 180)
      return
    }

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    transitionTimerRef.current = setTimeout(() => setJumpTransition(null), 920)
  }

  return (
    <>
      <FontLoader />
      <div className="grain carbon-bg" style={{ minHeight: '100vh' }}>

        <div className="progress-bar" style={{ width: `${pct}%` }} />

        {jumpTransition && (
          <div className={`launch-overlay ${jumpTransition.direction}`} aria-hidden="true">
            <div className="launch-overlay__rails" />
            <div className="launch-overlay__pulse" />
            <div className="launch-overlay__track" />
            <div className="launch-overlay__core">
              <div className="launch-overlay__signal-row" aria-hidden="true">
                <span className="launch-overlay__signal" />
                <span className="launch-overlay__signal" />
                <span className="launch-overlay__signal" />
                <span className="launch-overlay__signal" />
                <span className="launch-overlay__signal" />
              </div>
              <div className="launch-overlay__badge">PIT LANE TRANSFER</div>
              <div className="launch-overlay__title">
                {jumpTransition.label} <span>{jumpTransition.id.toUpperCase()}</span>
              </div>
              <div className="launch-overlay__sub">{transitionSubtitles[jumpTransition.id] || 'DRS OPEN • TELEMETRY LOCKED • SCROLLING'}</div>
            </div>
          </div>
        )}

        {/* NAV */}
        {renderNav?.({ scrollY, onNavigate: go })}

        {/* HERO */}
        {renderHero?.({
          onViewWork: () => go('projects'),
          onContact: () => go('contact'),
          resumeLink,
        })}

        <div className="divider-red" />
        <div className="divider" />

        {/* ABOUT */}
        {aboutSection}

        <div className="divider" />

        {/* WORK TIMELINE */}
        {workTimelineSection}

        <div className="divider" />

        {/* TECH STACK */}
        {techStackSection}

        <div className="divider" />

        {/* PROJECTS */}
        {projectsSection}

        <div className="divider" />

        {/* CONTACT */}
        {contactSection}

        {/* FOOTER */}
        {footerSection}

        {/* Side elements */}
        {sideElements}

      </div>
    </>
  )
}