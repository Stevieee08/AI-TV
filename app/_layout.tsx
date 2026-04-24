import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/themeStore';
import '../global.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    console.error('Error Stack:', error.stack);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorSubText}>Error: {this.state.error?.message}</Text>
          <Text style={styles.errorSubText}>Please restart the app</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

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
    // Add safety timeout to prevent hanging on cold boot
    const safetyTimer = setTimeout(() => setIsInitializing(false), 5000);
    
    restoreSession().then(() => {
      clearTimeout(safetyTimer);
      // Small delay to ensure smooth transition
      setTimeout(() => setIsInitializing(false), 100);
      loadTheme();
    }).catch((error) => {
      console.error('Session restore failed:', error);
      clearTimeout(safetyTimer);
      setIsInitializing(false);
    });

    return () => clearTimeout(safetyTimer);
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
        <Text style={{ marginTop: 8, color: theme.textMuted, fontSize: 12 }}>App will continue automatically...</Text>
        <Text style={{ marginTop: 4, color: theme.textMuted, fontSize: 10 }}>Starting in 1-2 seconds...</Text>
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
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
