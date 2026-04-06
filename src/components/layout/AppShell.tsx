import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { ToastContainer } from '../ui/Toast';

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <TopBar />
      <ToastContainer />

      <main className="lg:ml-64 pt-14 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        <Outlet />
      </main>

      <BottomTabBar />
    </div>
  );
}
