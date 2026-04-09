import { type ReactNode, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';

interface AppShellProps {
  children?: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

export function AppShell({ children, title, headerActions }: AppShellProps) {
  // Lock body scroll and handle initial shell setup if needed
  useEffect(() => {
    // Shared shell logic (e.g., analytics page view triggers) can go here.
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary-container selection:text-on-primary-container">
      {/* Toast provider handles its own fixed container, but we keep an eye on it */}
      
      {/* Desktop Sidebar — hidden on mobile */}
      <Sidebar />

      {/* Primary Viewport Area — Offset by sidebar on desktop */}
      <div className="md:ml-60 flex flex-col min-h-screen">
        {/* Contextual TopBar — fixed to top of viewport */}
        <TopBar title={title} headerActions={headerActions} />

        {/* Global Toast Container managed via Provider Context */}

        {/* Main Content — padded for BottomTabBar on mobile, offset on desktop */}
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Tab Bar — hidden on desktop */}
      <BottomTabBar />
    </div>
  );
}
