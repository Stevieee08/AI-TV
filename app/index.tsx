import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // If still loading, show nothing or a loading indicator
  if (isLoading) {
    return null;
  }
  
  // If authenticated, let the normal routing take over (don't redirect)
  if (isAuthenticated) {
    return null;
  }
  
  // Only redirect to login if not authenticated
  return <Redirect href="/(auth)/login" />;
}
