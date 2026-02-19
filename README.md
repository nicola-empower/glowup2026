# Reclaim - Digital Sanctuary 🌿

> *Your body achieves what your mind believes.*

**Reclaim** is a high-performance "Digital Sanctuary" designed to combat burnout for driven professionals. It visualises the intangible cost of overworking through an elegant, ethereal interface that gently nudges users to disconnect at the end of the day.

Built as a Progressive Web App (PWA) with a focus on "Soft Luxury" aesthetics, it combines psychological cues with strict utility to enforce work-life boundaries.

---

## ✨ Key Features

### 🌙 Core "Health Engine"
- **Visualised Burnout**: A glowing "Health Orb" represents your evening energy. It pulses steadily during the day but begins to degrade and fade if you work past the 18:00 deadline.
- **Overtime Penalty**: Working late physically drains the orb's light, creating a visceral feedback loop to encourage logging off.

### 🎨 Immersive Atmosphere
- **Dynamic Themes**: 
  - **Day Mode**: Crisp Cream & Burgundy ("Focus").
  - **Golden Hour**: Soft gradients warning of the approaching deadline.
  - **Night Mode**: Deep Burgundy & Champagne ("Glow Down").
- **Audio Soundscapes**: Hidden audio player that automatically fades in rain or white noise when the day ends.
- **Breathing Mode**: Interactive box-breathing guide (4-4-4-4) accessible by tapping the orb.

### 📊 Consistency & Tracking (Cloud Sync)
- **Streak Calendar**: A visual grid of "Gold Days" to track your consistency over the month.
- **Daily Dashboard**: Track hydration, vitamins, mood, and journaling.
- **Cloud Persistence**: Seamlessly syncs all data to a private **Google Sheet** via a custom Serverless API (Apps Script), ensuring streaks are never lost.

### 📲 PWA (Installable)
- **Install App**: Full native-like experience on iOS and Android.
- **Offline Ready**: Works without an internet connection.
- **Smart Notifications**: "Wind Down" alerts sent at 17:30 to prepare you for the end of the day.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: Framer Motion (Complex state transitions & micro-interactions)
- **Icons**: Lucide React
- **Cloud/Backend**: Google Apps Script (Serverless) + Google Sheets API
- **PWA**: `vite-plugin-pwa` (Service Workers, Manifest)

---

## 🚀 Commercial Development Breakdown

*Estimated value for a custom "Micro-SaaS" or Internal Tool of this caliber.*

| Feature / Phase | Description | Estimated Hours | Value (Est.) |
| :--- | :--- | :---: | :---: |
| **1. UI/UX Architecture** | Design system (Glassmorphism), colour psychology, responsive layout, and interactive prototyping. | 15h | £1,400 |
| **2. Core Logic Engine** | `useTime` hooks, Health decay algorithms, and Streak calculation logic. | 10h | £950 |
| **3. Advanced Animations** | Framer Motion integration for "Breathing" orb, page transitions, and dynamic background shifts. | 12h | £1,150 |
| **4. PWA Implementation** | Service worker configuration, Manifest setup, "Install" flows, and offline caching strategies. | 8h | £750 |
| **5. Cloud Integration** | Custom Google Apps Script backend development, API security, and React connection. | 10h | £950 |
| **6. Polish & Asset Gen** | Icon generation, Soundscape integration, Mobile testing, and accessibility refinement. | 5h | £500 |
| **TOTAL** | **High-fidelity MVP deliverable** | **60h** | **~£5,700** |

*> **Note**: This valuation includes the "Invisible Work" of performance optimization, state management architecture, and cross-device compatibility testing.*

---

## 💻 Installation

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/nicola-empower/reclaim.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## ☁️ Backend Setup (Google Sheets)

To enable cloud sync:

1.  Create a new **Google Sheet**.
2.  Go to **Extensions > Apps Script**.
3.  Copy the contents of `google_apps_script.md` (or `Code.gs`) into the editor.
4.  **Deploy as Web App** (Execute as: Me, Access: Anyone).
5.  Paste the **Web App URL** into `src/services/api.js`.

---


---

## 🚀 Deploy to Vercel

This project is optimised for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and **Add New Project**.
3.  Import your repository.
4.  Vercel will detect **Vite** automatically.
5.  Click **Deploy**.

*(Note: The `vercel.json` file included determines the rewrite rules for the Single Page Application routing).*

---

*Created by Nicola | 2026*
