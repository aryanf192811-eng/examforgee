# ExamForge Frontend

Welcome to the **ExamForge** frontend, a high-fidelity academic platform built with React, Vite, and Tailwind CSS.

## 🚀 Deployment Ready

This repository is optimized for one-click deployment to **Vercel** and **GitHub**.

### Prerequisites

Ensure you have the following environment variables configured in your deployment settings (Vercel):

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

- **CI/CD:** Automated build verification via `GitHub Actions` on every push to `main`.
- **Deployment:** Zero-config integration with `Vercel` via `vercel.json`.
- **Typing:** Strict TypeScript checks during the build phase (`tsc -b`).

## 🎨 Technology Stack

- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4.0
- **Animations:** Framer Motion
- **Icons/Math:** Katex & SVG Icons
- **State Management:** Zustand
