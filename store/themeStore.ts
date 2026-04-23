import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'aitv_theme';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: false, // white mode by default

  toggleTheme: async () => {
    const newVal = !get().isDark;
    set({ isDark: newVal });
    await AsyncStorage.setItem(THEME_KEY, newVal ? 'dark' : 'light');
  },

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    set({ isDark: saved === 'dark' });
  },
}));

// Light theme colors (matching the SkillUp app screenshots)
export const lightTheme = {
  background: '#F5F7FF',
  surface: '#FFFFFF',
  surfaceHigh: '#EEF1FF',
  border: '#E2E6FF',
  textPrimary: '#1A1D2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  primary: '#3D5AFE',
  primaryLight: '#6B7FFF',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#F4A100',
  tabBar: '#FFFFFF',
  tabBorder: '#E2E6FF',
  statusBar: 'dark-content' as const,
};

// Dark theme colors (deep blue-gray, NOT pure black)
export const darkTheme = {
  background: '#12141C',
  surface: '#1C1F2E',
  surfaceHigh: '#252836',
  border: '#2A2D3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8F92A1',
  textMuted: '#555873',
  primary: '#3D5AFE',
  primaryLight: '#6B7FFF',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#F4A100',
  tabBar: '#1C1F2E',
  tabBorder: '#2A2D3E',
  statusBar: 'light-content' as const,
};

export type Theme = typeof lightTheme;
