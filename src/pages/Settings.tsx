import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../lib/store/authStore';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { addToast } = useToast();

  return (
    <AppShell title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="max-w-lg mx-auto space-y-6"
      >
        {/* Appearance */}
        <div className="rounded-2xl bg-surface-container p-5">
          <h3 className="font-headline text-title-lg text-on-surface mb-4">
            Appearance
          </h3>

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                {isDark ? 'dark_mode' : 'light_mode'}
              </span>
              <div>
                <span className="text-body-md text-on-surface block">Theme</span>
                <span className="text-label-sm text-on-surface-variant capitalize">
                  {theme === 'dark' ? 'Tokyo Night' : 'Sakura Pastel'}
                </span>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleTheme}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors spring-transition cursor-pointer',
                isDark ? 'bg-primary' : 'bg-surface-container-highest'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform spring-transition',
                  isDark ? 'translate-x-5.5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-surface-container p-5">
          <h3 className="font-headline text-title-lg text-on-surface mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <ToggleRow
              icon="notifications"
              label="Push Notifications"
              description="Receive reminders for daily study goals"
              defaultChecked={true}
            />
            <ToggleRow
              icon="mail"
              label="Email Notifications"
              description="Weekly progress reports and updates"
              defaultChecked={false}
            />
            <ToggleRow
              icon="local_fire_department"
              label="Streak Reminders"
              description="Don't break your study streak"
              defaultChecked={true}
            />
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl bg-surface-container p-5">
          <h3 className="font-headline text-title-lg text-on-surface mb-4">
            Account
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => addToast('Password change requires re-authentication via Firebase.', 'info')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-container-high transition-colors spring-transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
                lock
              </span>
              <div className="flex-1 text-left">
                <span className="text-body-md text-on-surface block">Change Password</span>
                <span className="text-label-sm text-on-surface-variant">
                  {user?.email || 'your@email.com'}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                chevron_right
              </span>
            </button>

            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-container-high transition-colors spring-transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-error text-[22px]">
                logout
              </span>
              <span className="text-body-md text-error">Sign Out</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl bg-surface-container p-5 text-center">
          <span className="text-label-md text-on-surface-variant">
            ExamForge v2.0 · The Academic Atelier
          </span>
        </div>
      </motion.div>
    </AppShell>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  defaultChecked,
}: {
  icon: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[22px]">
          {icon}
        </span>
        <div>
          <span className="text-body-md text-on-surface block">{label}</span>
          <span className="text-label-sm text-on-surface-variant">{description}</span>
        </div>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-5 h-5 accent-primary rounded cursor-pointer"
      />
    </label>
  );
}
