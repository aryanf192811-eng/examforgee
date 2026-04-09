import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('ef_theme', theme);
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('ef_theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark'; // default: Tokyo Night
}

/**
 * Theme store — manages the aesthetic configuration of the application.
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
