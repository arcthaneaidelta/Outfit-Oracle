# OutfitOracle — Project Overview

OutfitOracle is a premium, AI-driven style assistant designed to bridge the gap between high-end fashion editorial aesthetics and daily style management. This application provides a luxurious, investor-ready experience for fashion-conscious users.

## 🛠️ Technology Stack

### **Frontend Architecture**
*   **Core Library**: [React.js (v18)](https://reactjs.org/) — Powering a high-performance, single-page application (SPA).
*   **Build System**: [Vite](https://vitejs.dev/) — Optimized for ultra-fast development and lean production builds.
*   **State Management**: React Context API & Custom Hooks (used for Authentication, Wardrobe, and UI states).
*   **Styling System**: **Custom Vanilla CSS (CSS3)** — A bespoke "Luxury Fashion Editorial" design system using CSS Variables for multi-theme support (Light/Dark Mode).
*   **Routing**: React Router v6.

### **Backend & Infrastructure (Powered by Google Firebase)**
*   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) — Real-time, scalable NoSQL database for instant syncing of wardrobe data across devices.
*   **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) — Secure handling of user identities, supporting email/password and secure profile management.
*   **Deployment**: [Netlify](https://www.netlify.com/) — Automated CI/CD pipeline for production-grade hosting.

### **External Integrations**
*   **Weather Intelligence**: [OpenWeatherMap API](https://openweathermap.org/api) — Real-time weather fetching used to generate smart, temperature-aware outfit recommendations.

---

## ✨ Key Features

### 1. **Cinematic Onboarding**
A high-fidelity, motion-designed loading sequence using CSS3 keyframe animations and glassmorphism to establish a premium brand identity from the first second.

### 2. **AI-Driven Recommendation Engine**
A proprietary algorithm that analyzes the user's current wardrobe against real-time weather data and style preferences to suggest the perfect daily outfit.

### 3. **Smart Wardrobe Management**
Visual inventory of clothing items categorized by type (Top, Bottom, Shoes, etc.), with full CRUD (Create, Read, Update, Delete) capabilities synced to the cloud.

### 4. **Outfit Builder & Planner**
Allows users to curate "Outfits" from their items and schedule them on a visual calendar to eliminate morning decision fatigue.

### 5. **Premium Dashboard**
A unified style command center featuring:
*   **Real-time Weather Badge**: Local conditions in a stylized card.
*   **Style Stats**: Dynamic counters for wardrobe growth and wear frequency.
*   **Dual Theme Support**: A fully integrated Dark Mode toggle for a "Midnight Premium" experience.

### 6. **User Security & Profile**
Interactive profile management section for updating personal information and secure password management.

---

## 🎨 Design Philosophy
*   **Aesthetic**: Luxury Fashion Editorial (High-end magazine vibe).
*   **Typography**: Playfair Display (Serif) for elegance & DM Sans (Sans-serif) for modern legibility.
*   **UX**: Minimalist, intent-driven navigation with subtle micro-interactions (hover states, smooth transitions).
