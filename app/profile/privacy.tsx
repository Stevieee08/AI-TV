import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

const SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect information you provide when creating an account, such as your username and email address. We also collect usage data including courses viewed, bookmarked, and enrolled in.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to provide and personalize the AITV learning experience, send relevant notifications, and ensure the security of your account.' },
  { title: '3. Data Storage & Security', body: "Authentication tokens are stored using Expo SecureStore (Keychain on iOS, Keystore on Android). App data is stored locally using AsyncStorage." },
  { title: '4. Third-Party Services', body: 'AITV uses the FreeAPI public API for course and instructor data. We do not sell or share your personal data with third-party advertisers.' },
  { title: '5. Notifications', body: 'Push notifications are only sent with your explicit permission. You may revoke permissions at any time from your device settings.' },
  { title: '6. Your Rights', body: 'You have the right to access, correct, or delete your personal data. Contact us at privacy@aitv.app for data requests.' },
  { title: '7. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. Significant changes will be communicated via in-app notification.' },
  { title: '8. Contact Us', body: 'Questions about this Privacy Policy? Contact us at privacy@aitv.app or through the Help & Support section.' },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: theme.border }}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>Privacy Policy</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={{ backgroundColor: theme.surface, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 }}>AITV Privacy Policy</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Last updated: January 2025</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 22, marginTop: 10 }}>At AITV, we take your privacy seriously. This policy explains what data we collect, how we use it, and your rights.</Text>
        </View>
        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 6 }}>{section.title}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 22 }}>{section.body}</Text>
          </View>
        ))}
        <View style={{ backgroundColor: theme.primary + '15', borderWidth: 1, borderColor: theme.primary + '30', borderRadius: 18, padding: 16, marginBottom: 24 }}>
          <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 13 }}>Privacy Contact</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>privacy@aitv.app</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
