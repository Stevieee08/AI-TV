import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const bottomPad = Platform.OS === 'ios' ? 24 : 14;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBorder,
          borderTopWidth: 1,
          height: 60 + bottomPad,
          paddingBottom: bottomPad,
          paddingTop: 8,
          elevation: 8,
          shadowColor: isDark ? '#000' : '#94A3B8',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.4 : 0.12,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mycourses"
        options={{
          title: 'My Courses',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
