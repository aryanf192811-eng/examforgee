import { useThemeStore } from '../lib/store/themeStore';

/**
 * Convenience hook for theme management.
 * Wraps the theme store for use in components.
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const isDark = theme === 'dark';

  return { theme, isDark, toggleTheme, setTheme };
}
