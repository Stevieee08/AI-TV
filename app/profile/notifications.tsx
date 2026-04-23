import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';

const NOTIFICATION_SETTINGS = [
  { label: 'Push Notifications', description: 'Receive alerts on your device', key: 'push' },
  { label: 'Course Reminders', description: 'Daily nudges to keep learning', key: 'reminders' },
  { label: 'Bookmark Milestones', description: 'Alert when you hit 5+ bookmarks', key: 'bookmarks' },
  { label: 'New Course Alerts', description: 'When new courses are available', key: 'new_courses' },
  { label: 'Enrollment Updates', description: 'Confirmations and status changes', key: 'enrollment' },
  { label: 'Weekly Progress', description: 'Summary of your weekly activity', key: 'weekly' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { scheduleBookmarkMilestoneNotification } = useNotifications();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    push: true, reminders: true, bookmarks: true, new_courses: false, enrollment: true, weekly: false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: theme.border }}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>Notifications</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4 }}>Notification Preferences</Text>
        <View style={{ backgroundColor: theme.surface, borderRadius: 18, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          {NOTIFICATION_SETTINGS.map((item, index) => (
            <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: index < NOTIFICATION_SETTINGS.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: '500', fontSize: 14 }}>{item.label}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{item.description}</Text>
              </View>
              <Switch value={settings[item.key]} onValueChange={() => setSettings((p) => ({ ...p, [item.key]: !p[item.key] }))} trackColor={{ false: theme.border, true: theme.primary }} thumbColor="#fff" />
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: theme.primary + '15', borderWidth: 1, borderColor: theme.primary + '30', borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>Device Permissions</Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 20 }}>Make sure AITV has notification permissions enabled in your device settings.</Text>
        </View>
        <TouchableOpacity onPress={() => scheduleBookmarkMilestoneNotification(5)} style={{ backgroundColor: theme.surface, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 14 }}>Send Test Notification</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
