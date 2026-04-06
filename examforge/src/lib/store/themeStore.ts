import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: (localStorage.getItem('ef_theme') || 'dark') === 'dark',
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('ef_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('ef_theme', 'light');
      }
      return { isDark: next };
    }),
  setTheme: (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ef_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ef_theme', 'light');
    }
    set({ isDark: dark });
  },
}));
