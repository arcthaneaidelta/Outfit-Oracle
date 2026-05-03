import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/loading.css';

/* ── Floating Particle System ── */
function Particles({ count = 35 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    })), [count]);

  return (
    <div className="ld-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="ld-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Fashion Icon Components ── */
const Icons = {
  Hanger: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V9l7 5v1H4v-1l7-5V5.72A2 2 0 0 1 12 2z" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </svg>
  ),
  Dress: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M8 2h8l-2 6h4l-6 14-6-14h4L8 2z" />
    </svg>
  ),
  Bag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Diamond: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20M12 22 6 9M12 22l6-13M6 3l6 6M18 3l-6 6" />
    </svg>
  ),
  Shoe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M3 18h18v2H3zM4 18c0-4 1-7 3-9l2 3c3-2 5-1 7 0l2-3c2 2 3 5 3 9" />
    </svg>
  ),
  Crown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 17l3-10 5 6 2-11 2 11 5-6 3 10z" />
      <path d="M2 17h20v3H2z" />
    </svg>
  ),
};

const iconEntries = Object.entries(Icons);

/* ── Main Loading Screen ── */
export default function LoadingScreen({ text = "Preparing your style experience...", isExiting = false }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=initial, 1=icons visible, 2=brand visible, 3=progress visible

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase < 3) return;
    const timer = setInterval(() => {
      setProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 4 + 1);
    }, 180);
    return () => clearInterval(timer);
  }, [phase]);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`ld-screen ${isExiting ? 'ld-exit' : ''}`}>
      {/* Ambient Background Layers */}
      <div className="ld-bg-gradient" />
      <Particles />

      {/* Decorative Orbit Rings */}
      <div className="ld-orbits">
        <div className="ld-orbit ld-orbit-1" />
        <div className="ld-orbit ld-orbit-2" />
        <div className="ld-orbit ld-orbit-3" />
      </div>

      {/* Floating Fashion Icons */}
      <div className={`ld-icons-ring ${phase >= 1 ? 'ld-visible' : ''}`}>
        {iconEntries.map(([name, Icon], i) => {
          const angle = (i / iconEntries.length) * 360;
          return (
            <div
              key={name}
              className="ld-icon-bubble"
              style={{
                '--angle': `${angle}deg`,
                '--delay': `${i * 0.15}s`,
              }}
            >
              <Icon />
            </div>
          );
        })}
      </div>

      {/* Central Content */}
      <div className={`ld-center ${phase >= 2 ? 'ld-visible' : ''}`}>
        {/* Glowing Accent */}
        <div className="ld-glow-orb" />

        {/* Brand */}
        <div className="ld-brand-icon">✦</div>
        <h1 className="ld-brand">
          <span className="ld-brand-o">Outfit</span>
          <span className="ld-brand-r">Oracle</span>
        </h1>

        {/* Tagline with staggered word reveal */}
        <div className="ld-tagline">
          {'Smart Outfits, Zero Guesswork'.split(' ').map((word, i) => (
            <span
              key={i}
              className="ld-tagline-word"
              style={{ animationDelay: `${1.2 + i * 0.18}s` }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Progress Ring */}
        <div className={`ld-progress ${phase >= 3 ? 'ld-visible' : ''}`}>
          <svg viewBox="0 0 120 120" className="ld-progress-svg">
            {/* Outer decorative ring */}
            <circle cx="60" cy="60" r="58" className="ld-ring-outer" />
            {/* Track */}
            <circle cx="60" cy="60" r="52" className="ld-ring-track" />
            {/* Fill */}
            <circle
              cx="60" cy="60" r="52"
              className="ld-ring-fill"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
            {/* Inner decorative */}
            <circle cx="60" cy="60" r="46" className="ld-ring-inner" />
          </svg>
          <div className="ld-progress-text">
            <span className="ld-pct">{Math.round(progress)}</span>
            <span className="ld-pct-sign">%</span>
          </div>
        </div>

        {/* Status */}
        <p className={`ld-status ${phase >= 3 ? 'ld-visible' : ''}`}>{text}</p>
      </div>

      {/* Bottom Decorative Line */}
      <div className="ld-bottom-line" />
    </div>
  );
}
