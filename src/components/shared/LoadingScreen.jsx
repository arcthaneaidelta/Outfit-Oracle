import React, { useState, useEffect } from 'react';
import '../../styles/loading.css';

const FashionIcons = {
  Hanger: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M2 11c0-2.2 2-4 4.5-4 2 0 3.3 1.2 4.1 2.3.4.6 1.4.6 1.8 0 .8-1.1 2.1-2.3 4.1-2.3 2.5 0 4.5 1.8 4.5 4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9z" />
    </svg>
  ),
  Suit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20M20 2v20M4 7l8 4 8-4M12 11v11" />
    </svg>
  ),
  Bag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Shoe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18l-3-7H6l-3 7ZM6 14l2-6h8l2 6" />
    </svg>
  ),
  Mannequin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-1 3.5-2 5h-4c-1-1.5-2-3.5-2-5a4 4 0 0 1 4-4ZM12 11v11M9 22h6" />
    </svg>
  )
};

export default function LoadingScreen({ text = "Preparing your style experience...", isExiting = false }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 5));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`elegant-loading-container ${isExiting ? 'fade-out' : ''}`}>

      {/* Cinematic Glow Streaks */}
      <div className="glow-streaks">
        <div className="streak"></div>
        <div className="streak streak-alt"></div>
      </div>

      <div className="elegant-loading-content">
        {/* Elliptical Orbit System */}
        <div className="orbit-wrap">
          <div className="badge-orbit-container">
            <div className="badge-item badge-1"><FashionIcons.Hanger /></div>
            <div className="badge-item badge-2"><FashionIcons.Suit /></div>
            <div className="badge-item badge-3"><FashionIcons.Bag /></div>
            <div className="badge-item badge-4"><FashionIcons.Star /></div>
            <div className="badge-item badge-5"><FashionIcons.Shoe /></div>
            <div className="badge-item badge-6"><FashionIcons.Mannequin /></div>
          </div>
        </div>

        {/* Central Brand Identity */}
        <div className="central-branding">
          <div className="monogram-logo">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="50" cy="50" r="38" strokeDasharray="2 4" opacity="0.3" />
              <path d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25Zm0 5c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20Z" fill="currentColor" fillOpacity="0.1" />
              <path d="M50 40c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10Z" strokeWidth="0.8" />
            </svg>
          </div>

          <h1 className="brand-title">Outfit<span>Oracle</span></h1>
          <div className="brand-subtitle">Smart Style Assistant</div>
          
          <div className="tagline">
            <span>Smart Outfits, Zero Guesswork</span>
          </div>

          {/* Elegant Progress Ring */}
          <div className="progress-wrap">
            <svg className="progress-ring-svg" viewBox="0 0 100 100">
              <circle className="progress-ring-bg" cx="50" cy="50" r="45" />
              <circle 
                className="progress-ring-fill" 
                cx="50" 
                cy="50" 
                r="45" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="percentage">{Math.round(progress)}%</div>
          </div>

          <p className="status-message">{text}</p>
          <div className="bottom-divider"></div>
        </div>
      </div>
    </div>
  );
}



