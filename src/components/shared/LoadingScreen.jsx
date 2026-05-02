import React from 'react';
import '../../styles/loading.css';

export default function LoadingScreen({ fullScreen = true, text = "Curating your wardrobe..." }) {
  return (
    <div className={`elegant-loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="elegant-loading-content">
        <div className="elegant-rings">
          <div className="ring ring-outer"></div>
          <div className="ring ring-inner"></div>
          <div className="ring-center"></div>
        </div>
        <h2 className="loading-brand-name">Outfit<span>Oracle</span></h2>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
}
