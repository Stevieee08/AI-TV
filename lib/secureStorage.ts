import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureSet = async (key: string, value: string): Promise<void> => {
  await SecureStore.setItemAsync(key, value);
};

export const secureGet = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

export const secureDelete = async (key: string): Promise<void> => {
  await SecureStore.deleteItemAsync(key);
};

export const storageSet = async (key: string, value: unknown): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const storageGet = async <T>(key: string): Promise<T | null> => {
  const item = await AsyncStorage.getItem(key);
  if (!item) return null;
  return JSON.parse(item) as T;
};

export const storageDelete = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
