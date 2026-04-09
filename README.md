<<<<<<< HEAD
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
=======
# ExamForge V2 Frontend

This is the ExamForge frontend application built using **Vite**, **React**, and **TypeScript**. It features a modern, responsive interface connecting to a unified Python backend and Supabase.

## Tech Stack
- **Framework**: React 18, Vite 
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS / Vanilla CSS
- **Authentication**: Firebase Auth
- **Database / Storage**: Supabase (Backend sync)

## Getting Started

1. Clone this repository.
2. Ensure you have Node.js and npm installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on the required keys for Firebase, Supabase, and the API.
5. Start the development server:
>>>>>>> 2a4a406161fa7f45e9412cad7c14b7e0027c1b2d
   ```bash
   npm run dev
   ```

<<<<<<< HEAD
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
=======
## Integrations
- Connects to the main `examforge-backend` for core API routes (`/api/*`).
- Handles authentications directly passing JWT tokens via Bearer headers to the backend to establish sessions seamlessly.
- Responsive layout with fully implemented dashboard, profiles, subjects, notes, and quiz system.
>>>>>>> 2a4a406161fa7f45e9412cad7c14b7e0027c1b2d
