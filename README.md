# ExamForge — Enterprise Academic Platform 🚀

A high-fidelity academic platform built for high-performance exam preparation (GATE CSE), featuring real-time progress tracking, AI-powered notes, and an advanced quiz engine.

## 🎨 Technology Stack

- **Framework**: React 19 (Vite 8)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion (Spring-based)
- **Icons/Math**: KaTeX (LaTeX rendering), Lucide Icons
- **State Management**: Zustand
- **Architecture**: Modern, mobile-responsive "Atelier" design system

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 20+ and npm installed. Configure the following environment variables (Vercel):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🛠️ Infrastructure & CI/CD

- **CI/CD**: Automated build verification via `GitHub Actions` on every push.
- **Deployment**: Zero-config integration with **Vercel** via `vercel.json`.
- **API**: Seamlessly connects to the ExamForge FastAPI backend via Bearer JWT authentication.
