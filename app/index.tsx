import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // If still loading, show nothing or a loading indicator
  if (isLoading) {
    return null;
  }
  
  // If authenticated, redirect to tabs
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  // Only redirect to login if not authenticated
  return <Redirect href="/(auth)/login" />;
}
