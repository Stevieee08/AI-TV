import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@/constants';

/**
 * Clears authentication tokens only, preserving user data like bookmarks and profile images
 * User data should persist across app restarts
 */
export const clearAuthTokensOnly = async (): Promise<void> => {
  try {
    // Clear only authentication tokens, preserve user data like username updates
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    // Don't remove USER_DATA to preserve username and other profile updates
    
    console.log('Cleared authentication tokens only');
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
    throw error;
  }
};

/**
 * Clears all existing user data from AsyncStorage and SecureStore
 * This includes bookmarks, enrolled courses, and any other user-specific data
 * Use this only for complete reset scenarios
 */
export const clearAllUserData = async (): Promise<void> => {
  try {
    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    
    // Filter keys that start with our app prefix
    const appKeys = keys.filter(key => 
      key.startsWith('aitv_') && 
      (key.includes('bookmarks') || key.includes('enrolled') || key.includes('user_data') || key.includes('local_avatar'))
    );
    
    // Remove all app-specific data
    if (appKeys.length > 0) {
      await AsyncStorage.multiRemove(appKeys);
    }
    
    // Clear secure store tokens
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    
    console.log('Cleared all existing user data');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Checks if any existing user data is present
 */
export const hasExistingUserData = async (): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => 
      key.startsWith('aitv_') && 
      (key.includes('bookmarks') || key.includes('enrolled') || key.includes('user_data'))
    );
    
    const hasAccessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    
    return appKeys.length > 0 || hasAccessToken !== null;
  } catch (error) {
    console.error('Error checking existing user data:', error);
    return false;
  }
};
