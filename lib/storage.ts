import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const secureSet = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
};

export const secureGet = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return await AsyncStorage.getItem(key);
  }
};

export const secureDelete = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await AsyncStorage.removeItem(key);
  }
};

export const asyncSet = async (key: string, value: unknown): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const asyncGet = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const asyncDelete = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
