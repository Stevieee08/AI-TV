import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import apiClient from '@/lib/api';
import { useCourseStore } from './courseStore';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (user: User) => void;
}

// Use AsyncStorage for tokens (works better in Expo Go)
async function secureSet(key: string, value: unknown): Promise<void> {
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  if (str && str.length > 0) {
    await AsyncStorage.setItem(key, str);
  }
}

async function secureGet(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

async function secureDel(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const response = await apiClient.post('/api/v1/users/login', { email, password });
    const { user: apiUser, accessToken, refreshToken } = response.data.data;

    // Get locally saved user data to preserve only profile updates (not username/email)
    const localUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const localUser = localUserData ? JSON.parse(localUserData) as User : null;
    
    // Use API data for new registration, but preserve profile image if exists
    const mergedUser = {
      ...apiUser,
      // Only preserve avatar from local data, not username or email
      avatar: localUser?.avatar || apiUser.avatar,
    };

    // Ensure tokens are valid non-empty strings before storing
    const accessStr = typeof accessToken === 'string' ? accessToken : String(accessToken ?? '');
    const refreshStr = typeof refreshToken === 'string' ? refreshToken : String(refreshToken ?? '');

    if (accessStr) await secureSet(STORAGE_KEYS.ACCESS_TOKEN, accessStr);
    if (refreshStr) await secureSet(STORAGE_KEYS.REFRESH_TOKEN, refreshStr);

    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mergedUser));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_OPENED, new Date().toISOString());

    set({
      user: mergedUser,
      tokens: { accessToken: accessStr, refreshToken: refreshStr },
      isAuthenticated: true,
      isLoading: false,
    });

    // Load user-specific course data
    const courseStore = useCourseStore.getState();
    await courseStore.loadPersistedData();
    courseStore.reapplyCourseStatus();
  },

  register: async (username, email, password) => {
    const response = await apiClient.post('/api/v1/users/register', { username, email, password });
    const { user: apiUser, accessToken, refreshToken } = response.data.data;

    // Get locally saved user data to preserve only profile updates (not username/email)
    const localUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const localUser = localUserData ? JSON.parse(localUserData) as User : null;
    
    // Use API data for new registration, but preserve profile image if exists
    const mergedUser = {
      ...apiUser,
      // Only preserve avatar from local data, not username or email
      avatar: localUser?.avatar || apiUser.avatar,
    };

    const accessStr = typeof accessToken === 'string' ? accessToken : String(accessToken ?? '');
    const refreshStr = typeof refreshToken === 'string' ? refreshToken : String(refreshToken ?? '');

    if (accessStr) await secureSet(STORAGE_KEYS.ACCESS_TOKEN, accessStr);
    if (refreshStr) await secureSet(STORAGE_KEYS.REFRESH_TOKEN, refreshStr);

    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mergedUser));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_OPENED, new Date().toISOString());

    set({
      user: mergedUser,
      tokens: { accessToken: accessStr, refreshToken: refreshStr },
      isAuthenticated: true,
      isLoading: false,
    });

    // Load user-specific course data
    const courseStore = useCourseStore.getState();
    await courseStore.loadPersistedData();
    courseStore.reapplyCourseStatus();
  },

  logout: async () => {
    try { await apiClient.post('/api/v1/users/logout'); } catch {}
    
    // Clear user-specific course data first
    const courseStore = useCourseStore.getState();
    await courseStore.clearUserData();
    
    await secureDel(STORAGE_KEYS.ACCESS_TOKEN);
    await secureDel(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_SCREEN);
    // Don't remove USER_DATA to preserve username and other profile updates
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: async () => {
    try {
      const accessToken = await secureGet(STORAGE_KEYS.ACCESS_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (accessToken && userData) {
        const user = JSON.parse(userData) as User;
        
        // If we have both token and user data, restore the session
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_OPENED, new Date().toISOString());
        set({
          user,
          tokens: { accessToken, refreshToken: '' },
          isAuthenticated: true,
          isLoading: false,
        });

        // Load user-specific course data
        const courseStore = useCourseStore.getState();
        await courseStore.loadPersistedData();
        courseStore.reapplyCourseStatus();
        return;
      } else if (userData) {
        // Have user data but no token - load user data but require login
        const user = JSON.parse(userData) as User;
        set({
          user,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      // Handle error silently
    }
    set({ isLoading: false, isAuthenticated: false });
  },

  updateUser: (user) => {
    AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    set({ user });
  },
}));
