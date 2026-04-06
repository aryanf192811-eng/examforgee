import { useThemeStore } from '../lib/store/themeStore';

export function useTheme() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggle = useThemeStore((s) => s.toggle);

  return { isDark, toggle };
}
