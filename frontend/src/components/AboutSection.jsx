import { useEffect, useRef, useState, useCallback } from "react";

/* ── Animated Counter ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setVal(target);
              clearInterval(timer);
            } else setVal(Math.floor(start));
          }, 20);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ── Reveal on scroll ─────────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Particle field ───────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h;
    const particles = [];
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        hue: Math.random() > 0.8 ? 350 : 0,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 350
            ? `rgba(232,0,45,${p.alpha})`
            : `rgba(255,255,255,${p.alpha * 0.5})`;
        ctx.fill();
      });
      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
}

/* ── Glitch Text ──────────────────────────────────────────────── */
function GlitchText({ children, style }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(
      () => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 200);
      },
      4000 + Math.random() * 3000,
    );
    return () => clearInterval(interval);
  }, []);
  return (
    <span
      className={glitching ? "glitch-active" : ""}
      style={{ position: "relative", display: "inline-block", ...style }}
      data-text={typeof children === "string" ? children : ""}
    >
      {children}
    </span>
  );
}

/* ── Magnetic Button ──────────────────────────────────────────── */
function MagneticChip({ children }) {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);
  return (
    <span
      ref={ref}
      className="ab-chip"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition:
          "transform 0.3s cubic-bezier(.23,1,.32,1), border-color .2s, color .2s, background .2s",
      }}
    >
      {children}
    </span>
  );
}

export default function AboutSection() {
  const [sectionRef, visible] = useReveal();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredSpec, setHoveredSpec] = useState(null);

  useEffect(() => {
    const handleMouse = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      setMousePos({
        x: (e.clientX / w - 0.5) * 2,
        y: (e.clientY / h - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const techSpecs = [
    { k: "Frontend", v: "React · Framer Motion · Tailwind CSS", icon: "⚛️" },
    { k: "Backend", v: "Node.js · Express · REST · Prisma", icon: "⚙️" },
    { k: "Database", v: "PostgreSQL · MongoDB · MySQL", icon: "🗄️" },
    { k: "DevOps", v: "Git · Vercel · AWS", icon: "☁️" },
    { k: "Design", v: "Figma · Motion · Typography", icon: "🎨" },
  ];

  const chips = [
    "React",
    "Express",
    "Node.js",
    "Python",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "Figma",
    "TypeScript",
    "MySQL",
    "AWS",
    "Git",
  ];

  const profileCards = [
    {
      emoji: "🎓",
      label: "Student",
      sub: "MIT ADT · Class of '27",
      color: "#38bdf8",
      accent: "rgba(56,189,248,0.12)",
    },
    {
      emoji: "💻",
      label: "Developer",
      sub: "Full Stack Engineer",
      color: "#E8002D",
      accent: "rgba(232,0,45,0.12)",
    },
    {
      emoji: "🏆",
      label: "Problem Solver",
      sub: "DSA & Competitive Prog.",
      color: "#a78bfa",
      accent: "rgba(167,139,250,0.12)",
    },
  ];

  const stats = [
    { lbl: "Experience", num: 3, suffix: "+ Yrs" },
    { lbl: "Shipped", num: 10, suffix: "+ Projects" },
    { lbl: "Commits", num: 200, suffix: "+" },
    { lbl: "Status", val: "OPEN", green: true },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=Share+Tech+Mono&display=swap');

        /* — Keyframes — */
        @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes pulseRing   { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes heroIn      { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroInLeft  { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes heroInRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes softGlow    { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.85;transform:scale(1.08)} }
        @keyframes shimmer     { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
        @keyframes barFill     { from{width:0%} to{width:var(--pct)} }
        @keyframes scanline    { 0%{transform:translateY(-100%)} 100%{transform:translateY(200vh)} }
        @keyframes nebula      { 0%,100%{opacity:.5;transform:scale(1) rotate(0deg)} 50%{opacity:.9;transform:scale(1.1) rotate(6deg)} }
        @keyframes orbit       { from{transform:rotate(0deg) translateX(160px) rotate(0deg)} to{transform:rotate(360deg) translateX(160px) rotate(-360deg)} }
        @keyframes orbitRev    { from{transform:rotate(0deg) translateX(110px) rotate(0deg)} to{transform:rotate(-360deg) translateX(110px) rotate(360deg)} }
        @keyframes floatBadge  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes typeIn      { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glitchClip1 { 0%,100%{clip-path:inset(30% 0 50% 0)} 25%{clip-path:inset(10% 0 60% 0)} 50%{clip-path:inset(50% 0 20% 0)} 75%{clip-path:inset(5% 0 80% 0)} }
        @keyframes glitchClip2 { 0%,100%{clip-path:inset(60% 0 10% 0)} 25%{clip-path:inset(80% 0 5% 0)} 50%{clip-path:inset(20% 0 60% 0)} 75%{clip-path:inset(40% 0 30% 0)} }
        @keyframes glitchX1    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} }
        @keyframes glitchX2    { 0%,100%{transform:translateX(0)} 33%{transform:translateX(3px)} 66%{transform:translateX(-3px)} }
        @keyframes cardFloat   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-3px) rotate(0.3deg)} }
        @keyframes borderTrace { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes specEnter   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes statCount   { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes hologram    { 0%,100%{opacity:0.6;filter:hue-rotate(0deg)} 50%{opacity:1;filter:hue-rotate(5deg)} }

        /* — Reveal delays — */
        .ab-d0,.ab-d1,.ab-d2,.ab-d3,.ab-d4,.ab-d5,.ab-d6,.ab-d7 { opacity:0 }
        .ab-visible .ab-d0 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .00s both }
        .ab-visible .ab-d1 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .08s both }
        .ab-visible .ab-d2 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .18s both }
        .ab-visible .ab-d3 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .28s both }
        .ab-visible .ab-d4 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .38s both }
        .ab-visible .ab-d5 { animation: heroInLeft  .9s cubic-bezier(.16,1,.3,1) .48s both }
        .ab-visible .ab-d6 { animation: heroInRight .9s cubic-bezier(.16,1,.3,1) .52s both }
        .ab-visible .ab-d7 { animation: heroIn  .9s cubic-bezier(.16,1,.3,1) .60s both }

        /* — Cards — */
        .ab-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: default;
          transition: border-color .3s, background .3s, transform .4s cubic-bezier(.23,1,.32,1), box-shadow .3s;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          position: relative;
          overflow: hidden;
        }
        .ab-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity .3s;
        }
        .ab-card:hover::before { opacity: 1 }
        .ab-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0;
          height: 2px; width: 0%;
          background: var(--card-color, #E8002D);
          transition: width .4s cubic-bezier(.23,1,.32,1);
        }
        .ab-card:hover::after { width: 100% }
        .ab-card:hover {
          background: rgba(255,255,255,0.045);
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--card-color, rgba(232,0,45,0.2));
        }

        .ab-card-icon {
          transition: transform .4s cubic-bezier(.23,1,.32,1);
          display: inline-block;
        }
        .ab-card:hover .ab-card-icon { transform: scale(1.3) rotate(-5deg) }

        /* — Chips — */
        .ab-chip {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          color: #555;
          padding: 6px 14px;
          cursor: default;
          white-space: nowrap;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
          display: inline-block;
          position: relative;
          overflow: hidden;
        }
        .ab-chip::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(232,0,45,0.08), transparent);
          transform: translateX(-100%);
          transition: transform .4s;
        }
        .ab-chip:hover::before { transform: translateX(100%) }
        .ab-chip:hover {
          border-color: rgba(232,0,45,0.5);
          color: #fff;
          background: rgba(232,0,45,0.06);
        }

        /* — Spec rows — */
        .ab-spec-row {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 14px 20px;
          transition: background .25s, padding-left .25s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .ab-spec-row::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px;
          background: #E8002D;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform .3s cubic-bezier(.23,1,.32,1);
        }
        .ab-spec-row:hover::before { transform: scaleY(1) }
        .ab-spec-row:hover { background: rgba(232,0,45,0.04); padding-left: 24px }
        .ab-spec-row:hover .ab-spec-key { color: #E8002D !important }
        .ab-spec-row:hover .ab-spec-icon { opacity: 1; transform: scale(1) }

        .ab-spec-icon {
          opacity: 0.3;
          transform: scale(0.85);
          transition: opacity .3s, transform .3s;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        /* — Stats — */
        .ab-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: default;
          transition: transform .3s cubic-bezier(.23,1,.32,1);
          position: relative;
        }
        .ab-stat::after {
          content: '';
          position: absolute; bottom: -8px; left: 0; right: 0;
          height: 1px;
          background: rgba(232,0,45,0.4);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .4s cubic-bezier(.23,1,.32,1);
        }
        .ab-stat:hover::after { transform: scaleX(1) }
        .ab-stat:hover { transform: translateY(-4px) }
        .ab-stat:hover .ab-stat-num { color: #fff !important }
        .ab-stat:hover .ab-stat-num.green { color: #6ee77a !important; text-shadow: 0 0 16px rgba(57,211,83,0.7) !important }

        /* — Progress bars — */
        .ab-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #E8002D, rgba(232,0,45,0.5));
          transform-origin: left;
          transition: width 1.2s cubic-bezier(.23,1,.32,1);
          position: relative;
          overflow: hidden;
        }
        .ab-bar-fill::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmer 2s linear infinite;
        }

        /* — Glitch — */
        .glitch-active::before, .glitch-active::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          color: #E8002D;
        }
        .glitch-active::before {
          animation: glitchClip1 .15s steps(1) both, glitchX1 .15s steps(1) both;
          opacity: 0.7;
        }
        .glitch-active::after {
          content: attr(data-text);
          color: #38bdf8;
          animation: glitchClip2 .15s steps(1) both, glitchX2 .15s steps(1) both;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .ab-grid { grid-template-columns: 1fr !important }
          .ab-stats-row { flex-wrap: wrap !important; gap: 20px !important }
          .ab-section { padding: 48px 20px 64px !important }
        }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        className={`ab-section${visible ? " ab-visible" : ""}`}
        style={{
          position: "relative",
          background: "#080808",
          overflow: "hidden",
          padding: "80px 56px 80px",
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
        aria-label="About me"
      >
        {/* Particle field */}
        <ParticleField />

        {/* Scanline texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            opacity: 0.6,
          }}
        />

        {/* Moving scanline */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "80px",
              background:
                "linear-gradient(to bottom, transparent, rgba(232,0,45,0.015), transparent)",
              animation: "scanline 8s linear infinite",
            }}
          />
        </div>

        {/* Grid overlay — parallax */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            backgroundImage: `
            linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)
          `,
            backgroundSize: "80px 80px",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 90% at 50% 50%,black 10%,transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 90% 90% at 50% 50%,black 10%,transparent 100%)",
            transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
            transition: "transform 1s cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        {/* Red glow — parallax */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -120,
            left: -100,
            zIndex: 2,
            pointerEvents: "none",
            width: 700,
            height: 520,
            background:
              "radial-gradient(ellipse, rgba(232,0,45,0.14) 0%, rgba(232,0,45,0.04) 40%, transparent 70%)",
            animation: "softGlow 7s ease-in-out infinite",
            transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 14}px)`,
            transition: "transform 1.4s cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        {/* Blue nebula — parallax */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            zIndex: 2,
            pointerEvents: "none",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(56,189,248,0.08) 0%, rgba(232,0,45,0.05) 45%, transparent 70%)",
            animation: "nebula 9s ease-in-out infinite",
            transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
            transition: "transform 1.8s cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        {/* Purple nebula */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            zIndex: 2,
            pointerEvents: "none",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)",
            animation: "nebula 11s ease-in-out infinite reverse",
            transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
            transition: "transform 1.6s cubic-bezier(0.23,1,0.32,1)",
          }}
        />

        {/* Left accent stripe */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none",
            width: 3,
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent, #E8002D 20%, #E8002D 80%, transparent)",
            opacity: 0.6,
          }}
        />

        {/* Corner accent TL */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 3,
            pointerEvents: "none",
            width: 60,
            height: 60,
            borderTop: "2px solid rgba(232,0,45,0.4)",
            borderLeft: "2px solid rgba(232,0,45,0.4)",
          }}
        />

        {/* Corner accent BR */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 3,
            pointerEvents: "none",
            width: 60,
            height: 60,
            borderBottom: "2px solid rgba(232,0,45,0.3)",
            borderRight: "2px solid rgba(232,0,45,0.3)",
          }}
        />

        {/* Bottom stripe */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 2,
            pointerEvents: "none",
            height: 2,
            width: "50%",
            background: "linear-gradient(to left, #E8002D, transparent)",
            opacity: 0.4,
          }}
        />

        {/* Ghost section number — parallax */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 40,
            top: "50%",
            transform: `translateY(-55%) translate(${mousePos.x * 15}px, ${mousePos.y * 10}px)`,
            zIndex: 2,
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(10rem,20vw,20rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "rgba(255,255,255,0.018)",
            transition: "transform 1.4s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          02
        </div>

        {/* ── Main content ── */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1100 }}>
          {/* Checker flag */}
          <div
            className="ab-d0"
            style={{
              width: 48,
              height: 8,
              marginBottom: 20,
              opacity: 0.18,
              backgroundImage:
                "repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)",
              backgroundSize: "8px 8px",
            }}
          />

          {/* Eyebrow badge */}
          <div className="ab-d0" style={{ marginBottom: 22 }}>
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: "0.6rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#E8002D",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 14,
                  height: 14,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1px solid #E8002D",
                    animation: "pulseRing 2s ease-out infinite",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1px solid #E8002D",
                    animation: "pulseRing 2s ease-out infinite .6s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#E8002D",
                    animation: "blink 1.4s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
              </span>
              Sector 02 · About ·{" "}
              <span style={{ color: "#444" }}>System Online</span>
            </span>
          </div>

          {/* Heading */}
          <h2
            className="ab-d1"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(3.8rem,9.5vw,9rem)",
              lineHeight: 0.84,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 18,
              position: "relative",
            }}
          >
            <GlitchText data-text="Hi, I'm a">Hi, I'm a</GlitchText>
            <br />
            <span
              style={{
                color: "#E8002D",
                position: "relative",
                display: "inline-block",
                lineHeight: 0.95,
              }}
            >
              Full‑Stack
              {/* Underline bar */}
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  height: 3,
                  background:
                    "linear-gradient(to right, #E8002D, rgba(232,0,45,0.1))",
                  display: "block",
                  transformOrigin: "left",
                  animation: visible
                    ? "barFill 1.2s cubic-bezier(.16,1,.3,1) .4s both"
                    : "none",
                  "--pct": "100%",
                  width: visible ? "100%" : "0%",
                }}
              />
            </span>{" "}
            Developer
          </h2>

          {/* Sub */}
          <p
            className="ab-d2"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "#484848",
              fontSize: "0.72rem",
              lineHeight: 1.9,
              maxWidth: 420,
              marginBottom: 56,
              letterSpacing: "0.05em",
            }}
          >
            Building fast, polished products at the intersection of engineering
            and design.
          </p>

          {/* Stats row */}
          <div
            className="ab-d3 ab-stats-row"
            style={{
              display: "flex",
              gap: 36,
              flexWrap: "wrap",
              padding: "18px 0 24px",
              marginBottom: 56,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 1,
                background:
                  "linear-gradient(to right, #E8002D 0%, rgba(232,0,45,0.3) 40%, transparent 70%)",
                width: "55%",
                opacity: 0.35,
              }}
            />
            {stats.map((s, i) => (
              <div
                key={s.lbl}
                className="ab-stat"
                style={{
                  animation: visible
                    ? `statCount .6s cubic-bezier(.16,1,.3,1) ${0.4 + i * 0.09}s both`
                    : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#383838",
                  }}
                >
                  {s.lbl}
                </span>
                <span
                  className={`ab-stat-num${s.green ? " green" : ""}`}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    letterSpacing: "-0.01em",
                    color: s.green ? "#39d353" : "#b8b8b8",
                    textShadow: s.green
                      ? "0 0 20px rgba(57,211,83,0.4)"
                      : "none",
                    transition: "color .25s, text-shadow .25s",
                  }}
                >
                  {s.num != null ? (
                    <Counter target={s.num} suffix={s.suffix} />
                  ) : (
                    s.val
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Profile Cards */}
          <div
            className="ab-d4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
              marginBottom: 60,
            }}
          >
            {profileCards.map((card, i) => (
              <div
                key={card.label}
                className="ab-card"
                style={{
                  "--card-color": card.color,
                  animation: visible
                    ? `heroIn .8s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.1}s both`
                    : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.color + "55";
                  e.currentTarget.style.background = card.accent;
                  setHoveredCard(i);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                  setHoveredCard(null);
                }}
              >
                <span
                  className="ab-card-icon"
                  style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0 }}
                >
                  {card.emoji}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.52rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: card.color,
                      marginBottom: 6,
                      transition: "letter-spacing .3s",
                      letterSpacing: hoveredCard === i ? "0.3em" : "0.2em",
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: "#5a5a5a",
                      fontSize: "0.95rem",
                      lineHeight: 1.4,
                      fontWeight: 400,
                    }}
                  >
                    {card.sub}
                  </p>
                </div>
                {/* Holographic corner */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: "0 16px 16px 0",
                    borderColor: `transparent ${card.color}44 transparent transparent`,
                    transition: "opacity .3s",
                    opacity: hoveredCard === i ? 1 : 0.3,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Two-column grid */}
          <div
            className="ab-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 52,
              alignItems: "start",
            }}
          >
            {/* Bio + chips */}
            <div className="ab-d5">
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "#5a5a5a",
                  fontSize: "1.08rem",
                  lineHeight: 1.9,
                  marginBottom: 18,
                  fontWeight: 400,
                }}
              >
                I'm a{" "}
                <strong
                  style={{
                    fontWeight: 700,
                    color: "#c8c8c8",
                    background:
                      "linear-gradient(90deg, #c8c8c8 0%, #fff 30%, #E8002D 60%, #fff 80%, #c8c8c8 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 4s linear infinite",
                  }}
                >
                  full-stack developer
                </strong>{" "}
                who obsesses over load times, clean architecture, and shipping
                products that feel as good as they perform.
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: "#5a5a5a",
                  fontSize: "1.08rem",
                  lineHeight: 1.9,
                  marginBottom: 40,
                }}
              >
                Currently pursuing my degree at{" "}
                <strong style={{ color: "#aaa", fontWeight: 700 }}>
                  MIT Art Design and Technology University
                </strong>
                , graduating in{" "}
                <strong style={{ color: "#aaa", fontWeight: 700 }}>2027</strong>
                . Every detail matters — every millisecond counts.
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  paddingTop: 24,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#383838",
                    marginBottom: 16,
                  }}
                >
                  Tech Stack ·
                  <span style={{ color: "#E8002D", marginLeft: 6 }}>
                    {chips.length} modules loaded
                  </span>
                </p>
                <ul
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {chips.map((chip, i) => (
                    <li
                      key={chip}
                      style={{
                        animation: visible
                          ? `heroIn .5s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.05}s both`
                          : "none",
                        opacity: 0,
                      }}
                    >
                      <MagneticChip>{chip}</MagneticChip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills panel */}
            <div
              className="ab-d6"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.018)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#E8002D",
                    flexShrink: 0,
                    animation: "blink 1.4s ease-in-out infinite",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.5rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#4a4a4a",
                    margin: 0,
                  }}
                >
                  Skills Breakdown
                </p>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.44rem",
                    color: "#252525",
                    letterSpacing: "0.1em",
                  }}
                >
                  ─ ─ ─ ─ ─ ─
                </span>
              </div>

              {/* Rows with progress bars */}
              <dl style={{ margin: 0, padding: "4px 0" }}>
                {techSpecs.map((row, i) => (
                  <div
                    key={row.k}
                    className="ab-spec-row"
                    style={{
                      borderBottom:
                        i !== techSpecs.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      flexDirection: "column",
                      gap: 8,
                      animation: visible
                        ? `specEnter .6s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.1}s both`
                        : "none",
                      opacity: 0,
                    }}
                    onMouseEnter={() => setHoveredSpec(i)}
                    onMouseLeave={() => setHoveredSpec(null)}
                  >
                    {/* Row top */}
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span className="ab-spec-icon">{row.icon}</span>
                      <dt
                        className="ab-spec-key"
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#363636",
                          width: 70,
                          flexShrink: 0,
                          transition: "color .2s",
                        }}
                      >
                        {row.k}
                      </dt>
                      <dd
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 400,
                          fontSize: "0.92rem",
                          color: "#5c5c5c",
                          lineHeight: 1.4,
                          margin: 0,
                          letterSpacing: "0.02em",
                          flex: 1,
                        }}
                      >
                        {row.v}
                      </dd>
                    </div>
                    {/* Progress bar */}
                    <div
                      style={{
                        height: 2,
                        background: "rgba(255,255,255,0.05)",
                        position: "relative",
                        overflow: "hidden",
                        marginLeft: 6,
                      }}
                    >
                      <div
                        className="ab-bar-fill"
                        style={{
                          height: "100%",
                          width: visible ? `${row.pct}%` : "0%",
                          transition: `width 1.4s cubic-bezier(.23,1,.32,1) ${0.7 + i * 0.12}s`,
                          background:
                            hoveredSpec === i
                              ? `linear-gradient(90deg, #E8002D, #ff6b8a)`
                              : `linear-gradient(90deg, #E8002D, rgba(232,0,45,0.4))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </dl>

              {/* Bottom accent */}
              <div
                style={{
                  height: 2,
                  background:
                    "linear-gradient(to right, #E8002D, rgba(232,0,45,0.1), transparent)",
                  opacity: 0.45,
                }}
              />

              {/* Corner TL accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: "0 16px 16px 0",
                  borderColor: "transparent #E8002D transparent transparent",
                  opacity: 0.4,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
