import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

/**
 * AppShell — wraps all authenticated pages.
 * Desktop: Fixed sidebar (240px) + TopBar (56px) + scrollable content
 * Mobile:  TopBar + scrollable content + BottomTabBar (fixed, 64px)
 * Breakpoint: md (768px)
 */
export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="md:ml-60 flex flex-col min-h-screen">
        <TopBar title={title} />

        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>

      <BottomTabBar />
    </div>
  );
}
