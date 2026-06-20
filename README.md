# MindSprint AI 🧠🚀
> Generative AI-Powered Mental Wellness & Academic Resilience Platform for Students preparing for JEE, NEET, UPSC, GATE, CAT, and CUET.

MindSprint AI is an **Exam Phase-Aware Copilot** built specifically to support students under intense academic pressure. Unlike generic mood trackers, it analyzes journals to identify imposter loops, procrastination guilt, study exhaustion, and score anxiety, updating daily next-day preparation guidelines called **"Tomorrow Shield"**.

---

## 📂 Project Architecture

```
/client
  /src
    /components      <- Navbar, SafetyModal, TomorrowShieldCard, BreathingReset
    /pages           <- Landing, Auth, Onboarding, Dashboard, Mood, Journal, Chat, Analytics, WeeklyReport, Profile, Safety
    /hooks           <- React Auth hooks
    /services        <- Front-end api.js client queries
    /context         <- React AuthContext state provider
    /utils           <- Visual assets and helper utilities
    index.css        <- CSS styles and gradient configurations
    main.jsx         <- Vite React root mount
    App.jsx          <- Route mappings and private route guards
/server
  /src
    /config          <- MongoDB connector + memory fallback orchestration
    /controllers     <- REST controllers (Auth, Mood check-in, Chat message, etc.)
    /routes          <- API endpoints mapping
    /models          <- Mongoose schemas (User, MoodLog, ChatMessage, etc.)
    /middleware      <- JWT checks and error handler loggers
    /services        <- AI Google Gemini caller and Exam Phase Engine
    /prompts         <- Parameterized prompt templates
    /seed            <- Aarav Sharma demo seeder script
    app.js           <- Express application configurations
    server.js        <- Server entry listener script
package.json         <- Concurrently dev setup
```

---

## ✨ Core Key Features

1. **Exam Phase Engine**: Backend engine calculating student journey phases (FOUNDATION, BUILDUP, INTENSIVE_PREP, REVISION_STRESS, FINAL_COUNTDOWN, POST_EXAM_RECOVERY) based on calendar date proximity and stress baseline ratings.
2. **AI Journaling Parser**: Analyzes free-form journals to extract emotional scales, triggers, and burnout ratings.
3. **SprintBuddy Chatbot**: Empathetic, calm student mentor chatbot. Takes user exam goals, active mood check-in history, and journal reports into account.
4. **Tomorrow Shield**: Glowing prediction cards generated every evening based on study details to protect students from upcoming fatigue barriers.
5. **Interactive Breathing Reset**: Beautiful circular pulsing Box Breathing guide to interrupt anxiety.
6. **Safety Disclaimers Modal**: Interactive modal detecting high distress indicator phrases (e.g. "hopeless", "give up") to intercept crisis loops with Indian toll-free helplines (Vandrevala Foundation, Kiran support).

---

## 🛠️ Local Installation & Setup

Follow these steps to run the application locally on your Windows machine:

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **MongoDB** (Optional): A local instance running on `mongodb://localhost:27017/mindsprint`.
  > [!NOTE]
  > **Resilient Database Fallback**: If no local MongoDB server is running, the server will log a warning and automatically degrade to an **In-Memory database mode**! You can test and inspect full logins, loggers, chat history, and reports without installing MongoDB.

### 2. Configure Environment variables
Navigate to `/server` and review `.env`.
The folder contains a pre-filled `.env` file that is ready to use:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindsprint
JWT_SECRET=mindsprint_super_secret_jwt_key_123!
GEMINI_API_KEY=
USE_MOCK_AI=true
```
- Set `USE_MOCK_AI=false` and insert a valid `GEMINI_API_KEY` to run with real Gemini API integration.
- Keeping `USE_MOCK_AI=true` runs the app in **Smart Interactive Mock AI mode**, which parses inputs locally to produce customized test cases.

### 3. Install Dependencies
Run the installation script in the root directory to set up both `/client` and `/server`:
```bash
npm run install-all
```

### 4. Seed Demo Data
To immediately populate the database with Aarav Sharma's JEE exam profile, daily check-ins, journal inputs, and chat logs, run the seeder script:
```bash
npm run seed --prefix server
```
- **Login Credentials**: Email: `aarav@mindsprint.ai` | Password: `password123`

### 5. Launch the Application
Run the root concurrent launch script:
```bash
npm run dev
```
- The backend API server will launch at: [http://localhost:5000](http://localhost:5000)
- The React + Vite client will launch at: [http://localhost:5173](http://localhost:5173)

---

## 🏥 Mental Health Support Disclaimer
MindSprint AI is an academic wellness copilot designed to encourage self-awareness and study fatigue resilience. It is not clinical medical support and does not replace therapists. If you are experiencing serious despair or danger, please access the Safety Help tab or connect directly with local emergency hotlines.
