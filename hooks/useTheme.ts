import { useThemeStore, lightTheme, darkTheme } from '@/store/themeStore';

export function useTheme() {
  const { isDark, toggleTheme } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;
  return { theme, isDark, toggleTheme };
}
