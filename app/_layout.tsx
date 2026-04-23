import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/themeStore';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 3, staleTime: 1000 * 60 * 5 },
  },
});

function RootLayoutNav() {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const { checkAndScheduleReminder } = useNotifications();
  const { theme } = useTheme();
  const { loadTheme } = useThemeStore();

  useEffect(() => {
    // Restore session
    restoreSession().then(() => {
      loadTheme();
      // Small delay to ensure smooth transition
      setTimeout(() => setIsInitializing(false), 100);
    });
  }, []);

  useEffect(() => {
    if (isLoading || isInitializing) return;
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
    // Remove the else if that was forcing redirect to tabs
    
    if (isAuthenticated) checkAndScheduleReminder();
  }, [isAuthenticated, isLoading, isInitializing, segments]);

  // Show loading screen during initialization
  if (isInitializing || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 16, color: theme.textPrimary, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="webview/[id]" />
      <Stack.Screen name="profile/my-courses" />
      <Stack.Screen name="profile/notifications" />
      <Stack.Screen name="profile/settings" />
      <Stack.Screen name="profile/help" />
      <Stack.Screen name="profile/privacy" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
