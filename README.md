# 🚀 PitchDeck — AI-Driven Startup Idea Intelligence Platform

PitchDeck is a full-stack, AI-powered platform designed to help founders validate, refine, and strengthen startup ideas through structured feedback, intelligent analysis, and community-driven insights.

It transforms traditional idea-sharing platforms into an **interactive thinking partner**, enabling real-time evaluation and strategic improvement of startup concepts.

---

## 🧠 Key Features

### ⚡ *AI Idea Stress-Tester*
- Simulates a **Venture Capitalist, market analyst, and devil’s advocate**
- Generates:
  - Multi-axis validation scores (Problem, Market, Uniqueness, Feasibility, Fundability)
  - SWOT analysis
  - Hard-hitting VC-style questions
  - Actionable next steps
- Designed to provide **deep, structured interrogation — not generic feedback**

---

### 🧬 *Founder DNA Analysis*
- Evaluates founder behavior and inputs to classify working style (Visionary / Executor / Analyst)
- Suggests ideal co-founder compatibility and improvement areas

---

### ⚔️ *Idea Battle Mode*
- Enables side-by-side comparison of startup ideas
- Community voting + AI-assisted comparison insights
- Drives engagement and competitive validation

---

### 🤝 *Co-Founder Matching*
- Connects founders based on:
  - Skills
  - Idea requirements
  - Compatibility signals
- Includes filtering and discovery features

---

### 📊 *Real-Time Leaderboard*
- Ranks trending ideas using a **cron-powered voting system**
- Weekly aggregation for dynamic visibility

---

### 📝 *Structured Feedback System*
- Multi-dimensional feedback using sliders:
  - Problem Clarity
  - Market Size
  - Uniqueness
  - Solution Quality
- Stored as structured JSON (not just comments)

---

### 💳 *Mentor Access (Simulated Payment Flow)*
- Razorpay-based simulated flow to unlock premium mentor feedback
- Adds product realism and monetization layer

---

### 🎨 *Premium UI/UX*
- Glassmorphic design with smooth animations
- Built using React + Tailwind CSS
- Responsive, modern, and interaction-focused

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js
- Express.js
- PostgreSQL (with advanced schema constraints)
- JWT Authentication

**Other**
- Node-Cron (leaderboard scheduling)
- GenAI integration (AI Stress Tester engine)

---

## ⚙️ Architecture Highlights

- Designed a **scalable PostgreSQL schema** with constraints (e.g., preventing duplicate votes)
- Modular REST API structure (routes, controllers, middleware)
- Secure authentication using JWT
- Optimized queries for performance and real-time updates

---

## 🎯 Vision
PitchDeck aims to become a next-generation startup intelligence platform, where ideas are not just shared — but challenged, validated, and evolved using AI and community insights.

## 🚀 Getting Started (Local Setup)
### 1. Clone the repository
bash                          \

git clone <your-repo-link>     \

cd pitchdeck                   \

### 2. Setup Backend
cd pitchdeck-api               \

npm install                    \

npm start                      \

### 3. Setup Frontend
cd pitchdeck-web               \

npm install                    \

npm run dev
### 4. Configure Environment Variables
Create a .env file in backend:
DATABASE_URL=
JWT_SECRET=
