import { useMemo } from 'react';

/* ── Floating Gold & Terracotta Particles ── */
function AuthParticles({ count = 45 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 12,
      opacity: Math.random() * 0.5 + 0.15,
      // Alternate between gold and terracotta tones
      hue: Math.random() > 0.5 ? 'gold' : 'terra',
    })), [count]);

  return (
    <div className="ab-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className={`ab-particle ab-particle--${p.hue}`}
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

/* ── Fashion Icon SVGs ── */
const FashionIcons = [
  // Hanger
  <svg key="hanger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V9l7 5v1H4v-1l7-5V5.72A2 2 0 0 1 12 2z" />
    <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
  </svg>,
  // Dress
  <svg key="dress" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M8 2h8l-2 6h4l-6 14-6-14h4L8 2z" />
  </svg>,
  // Shopping Bag
  <svg key="bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>,
  // Diamond
  <svg key="diamond" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M2 9h20M12 22 6 9M12 22l6-13M6 3l6 6M18 3l-6 6" />
  </svg>,
  // Shoe
  <svg key="shoe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M3 18h18v2H3zM4 18c0-4 1-7 3-9l2 3c3-2 5-1 7 0l2-3c2 2 3 5 3 9" />
  </svg>,
  // Crown
  <svg key="crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M2 17l3-10 5 6 2-11 2 11 5-6 3 10z" />
    <path d="M2 17h20v3H2z" />
  </svg>,
  // Heart
  <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
  // Star
  <svg key="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
];

/* ── Main Background Component ── */
export default function AuthBackground() {
  return (
    <div className="ab-wrap">
      {/* Warm ambient gradient */}
      <div className="ab-gradient" />

      {/* Floating particles */}
      <AuthParticles />

      {/* Decorative orbit rings */}
      <div className="ab-orbits">
        <div className="ab-orbit ab-orbit--1" />
        <div className="ab-orbit ab-orbit--2" />
        <div className="ab-orbit ab-orbit--3" />
      </div>

      {/* Slowly rotating fashion icon ring */}
      <div className="ab-icons-ring">
        {FashionIcons.map((icon, i) => {
          const angle = (i / FashionIcons.length) * 360;
          return (
            <div
              key={i}
              className="ab-icon-bubble"
              style={{
                '--angle': `${angle}deg`,
                '--delay': `${i * 0.2}s`,
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>

      {/* Large terracotta glow — top right */}
      <div className="ab-glow ab-glow--terra" />
      {/* Gold glow — bottom left */}
      <div className="ab-glow ab-glow--gold" />
      {/* Centered glow behind card */}
      <div className="ab-glow ab-glow--center" />

      {/* Decorative bottom line */}
      <div className="ab-bottom-line" />
    </div>
  );
}
