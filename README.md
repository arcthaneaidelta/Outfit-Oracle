# OutfitOracle 👗✨

> Smart outfit planning based on your wardrobe, weather, and occasion.

## Features

- 🔐 **Auth** — Secure email/password sign-up & login via Firebase Auth
- 👕 **Wardrobe** — Upload and manage your clothing items with photos, colors, seasons, and occasion tags
- ✏️ **Outfit Builder** — Combine wardrobe items into named, occasion-specific outfits
- ✨ **Recommendations** — AI-scored outfit suggestions based on live weather, occasion, and wear recency
- 📅 **Planner** — Calendar view to schedule outfits per day
- 📊 **Wear History** — Log and review every outfit you've worn
- ❤️ **Favorites** — Save your go-to looks for quick access
- 🌤️ **Live Weather** — Auto-fetched via Open-Meteo (free, no API key needed)

---

## Setup

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable the following:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in production mode
   - **Storage** → Start in production mode

### 2. Get Your Firebase Config

In Firebase Console → Project Settings → Your Apps → Add Web App → Copy the config object.

### 3. Add Config to the Project

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Deploy Security Rules

In the Firebase Console:

- Go to **Firestore → Rules** and paste the contents of `firestore.rules`
- Go to **Storage → Rules** and paste the contents of `storage.rules`

### 5. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to Firebase Hosting, Vercel, or any static host.

---

## Project Structure

```
src/
├── components/
│   ├── Auth/              # Login, Signup, AuthContext
│   ├── Dashboard/         # Main dashboard overview
│   ├── Wardrobe/          # Wardrobe + WearHistory
│   ├── OutfitBuilder/     # Outfit creation UI
│   ├── Recommendations/   # Scored outfit recommendations
│   ├── Planner/           # Calendar-based outfit planner
│   ├── Favorites/         # Saved outfit looks
│   └── shared/            # Sidebar, ToastContext
├── hooks/
│   ├── useFirestore.js    # Wardrobe, outfits, planner, history hooks
│   └── useWeather.js      # Open-Meteo weather hook
├── utils/
│   └── recommendations.js # Scoring engine + constants
└── styles/
    └── global.css         # Full design system
```

---

## Firestore Collections

| Collection | Description |
|---|---|
| `users` | User profiles (name, city, style prefs) |
| `clothing_items` | Wardrobe pieces with metadata |
| `outfits` | Saved outfits referencing item IDs |
| `planner` | Date → outfit assignments |
| `wear_history` | Log of worn outfits |

---

## Recommendation Scoring

Each outfit is scored 0–100 based on:

- **+30** Occasion match
- **+25** Season/weather match  
- **+10** Completeness bonus
- **−30** Worn today / recently worn penalty
- **−50** If outfit contains deleted items (hidden from results)

---

## Tech Stack

- **React 18** + Vite
- **Firebase 10** (Auth, Firestore, Storage)
- **Open-Meteo API** (free weather, no key needed)
- **date-fns** for date utilities
- **Playfair Display** + **DM Sans** typography
