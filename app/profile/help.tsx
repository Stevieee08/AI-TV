import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const FAQS = [
  { q: 'How do I enroll in a course?', a: 'Open any course, scroll to the bottom, and tap "Enroll". You\'ll get a confirmation and can start learning immediately.' },
  { q: 'Where are my bookmarked courses?', a: 'All bookmarked courses appear in the Bookmarks tab. Tap the bookmark icon on any course to save it.' },
  { q: 'How do I turn off notifications?', a: 'Go to Profile → Notification Settings. You can toggle individual notification types on or off.' },
  { q: 'Can I access courses offline?', a: 'Courses you have already opened are partially cached. The app shows an offline banner when there is no connection.' },
  { q: 'How do I change my username or password?', a: 'Go to Profile → Edit Profile to update your username and password.' },
  { q: 'Why am I getting a reminder notification?', a: 'AITV sends a reminder if you haven\'t opened the app in 24 hours. Disable in Profile → Notification Settings.' },
];

export default function HelpScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(open === i ? null : i);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: theme.border }}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>Help & Support</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: theme.primary + '15', borderWidth: 1, borderColor: theme.primary + '30', borderRadius: 18, padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="help-circle-outline" size={18} color={theme.primary} />
            <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 14 }}>How can we help?</Text>
          </View>
          <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 20 }}>
            Browse the FAQs below or email us at <Text style={{ color: theme.primary }}>support@aitv.app</Text>
          </Text>
        </View>
        <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4 }}>Frequently Asked Questions</Text>
        <View style={{ backgroundColor: theme.surface, borderRadius: 18, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          {FAQS.map((item, i) => (
            <View key={i} style={{ borderBottomWidth: i < FAQS.length - 1 ? 1 : 0, borderBottomColor: theme.border }}>
              <TouchableOpacity onPress={() => toggle(i)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 }} activeOpacity={0.7}>
                <Text style={{ color: theme.textPrimary, fontWeight: '500', fontSize: 14, flex: 1, marginRight: 12 }}>{item.q}</Text>
                <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={theme.textSecondary} />
              </TouchableOpacity>
              {open === i && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 22 }}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: theme.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 6 }}>Still need help?</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>Our support team responds within 24 hours on business days.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.primary + '18', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="mail-outline" size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: '500' }}>Email Support</Text>
              <Text style={{ color: theme.primary, fontSize: 13, marginTop: 2 }}>support@aitv.app</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
