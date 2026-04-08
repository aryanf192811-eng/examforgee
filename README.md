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
   ```bash
   npm run dev
   ```

## Integrations
- Connects to the main `examforge-backend` for core API routes (`/api/*`).
- Handles authentications directly passing JWT tokens via Bearer headers to the backend to establish sessions seamlessly.
- Responsive layout with fully implemented dashboard, profiles, subjects, notes, and quiz system.
