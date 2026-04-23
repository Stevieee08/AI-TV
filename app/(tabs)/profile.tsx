import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView,
  Alert, StatusBar, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useTheme } from '@/hooks/useTheme';
import { storageGet, storageSet } from '@/lib/secureStorage';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const getBookmarkedCourses = useCourseStore((s) => s.getBookmarkedCourses);
  const getEnrolledCourses = useCourseStore((s) => s.getEnrolledCourses);
  const bookmarkIds = useCourseStore((s) => s.bookmarks);
  const enrolledIds = useCourseStore((s) => s.enrolled);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?._id) {
      storageGet<string>(`aitv_local_avatar_${user._id}`).then((v) => { if (v) setLocalAvatar(v); });
    }
  }, [user?._id]);

  const bookmarked = getBookmarkedCourses();
  const enrolled = getEnrolledCourses();
  const avatarUri = localAvatar || user?.avatar?.url;

  const handleAvatarPress = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library in Settings to change your profile picture.'
      );
      return;
    }

    // Launch picker directly — no Alert, no intermediate text
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setLocalAvatar(uri);
      if (user?._id) {
        await storageSet(`aitv_local_avatar_${user._id}`, uri);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
          setLoggingOut(false);
        },
      },
    ]);
  };

  const GENERAL_ITEMS = [
    {
      label: 'Notifications',
      icon: 'notifications-outline' as const,
      iconColor: theme.primary,
      right: 'switch' as const,
      switchVal: notifEnabled,
      switchChange: setNotifEnabled,
    },
    {
      label: 'Dark Mode',
      icon: 'moon-outline' as const,
      iconColor: theme.primary,
      right: 'switch' as const,
      switchVal: isDark,
      switchChange: (_: boolean) => toggleTheme(),
    },
  ];

  const OTHER_ITEMS = [
    { label: 'FAQ', icon: 'help-circle-outline' as const, route: '/profile/help' },
    { label: 'Help & Support', icon: 'chatbubble-outline' as const, route: '/profile/help' },
    { label: 'Privacy Policy', icon: 'lock-closed-outline' as const, route: '/profile/privacy' },
    { label: 'Notification Settings', icon: 'settings-outline' as const, route: '/profile/notifications' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: '800' }}>Profile</Text>
            <TouchableOpacity onPress={() => router.push('/profile/settings' as never)}>
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: theme.surface, borderRadius: 18,
            padding: 16, marginBottom: 20,
            borderWidth: 1, borderColor: theme.border,
          }}>
            {/* Avatar with tap-to-change */}
            <TouchableOpacity
              onPress={handleAvatarPress}
              style={{ position: 'relative', marginRight: 14 }}
              activeOpacity={0.8}
            >
              <View style={{
                width: 68, height: 68, borderRadius: 34,
                overflow: 'hidden', borderWidth: 2.5,
                borderColor: theme.primary + '50',
              }}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 68, height: 68 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={{
                    flex: 1, backgroundColor: theme.primary + '20',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 26, fontWeight: '700', color: theme.primary }}>
                      {user?.username?.[0]?.toUpperCase() ?? 'G'}
                    </Text>
                  </View>
                )}
              </View>
              {/* Edit badge */}
              <View style={{
                position: 'absolute', bottom: 0, right: 0,
                backgroundColor: theme.primary, borderRadius: 10,
                width: 22, height: 22,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: theme.surface,
              }}>
                <Ionicons name="camera" size={11} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>
                {user?.username ?? 'User'}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{user?.email}</Text>
              <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                <View>
                  <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15 }}>{enrolled.length}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>Courses</Text>
                </View>
                <View>
                  <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15 }}>{bookmarked.length}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>Bookmarks</Text>
                </View>
                <View>
                  <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15 }}>0</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>Completed</Text>
                </View>
              </View>
            </View>
          </View>

          {/* General section */}
          <Text style={{
            color: theme.textSecondary, fontSize: 11, fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
          }}>
            General
          </Text>
          <View style={{
            backgroundColor: theme.surface, borderRadius: 18,
            overflow: 'hidden', marginBottom: 20,
            borderWidth: 1, borderColor: theme.border,
          }}>
            {GENERAL_ITEMS.map((item, i) => (
              <View
                key={item.label}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 16, paddingVertical: 14,
                  borderBottomWidth: i < GENERAL_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: theme.primary + '18',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12,
                }}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={{ color: theme.textPrimary, flex: 1, fontSize: 14, fontWeight: '500' }}>
                  {item.label}
                </Text>
                <Switch
                  value={item.switchVal}
                  onValueChange={item.switchChange}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>

          {/* Other section */}
          <Text style={{
            color: theme.textSecondary, fontSize: 11, fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
          }}>
            Other
          </Text>
          <View style={{
            backgroundColor: theme.surface, borderRadius: 18,
            overflow: 'hidden', marginBottom: 20,
            borderWidth: 1, borderColor: theme.border,
          }}>
            {OTHER_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => router.push(item.route as never)}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 16, paddingVertical: 14,
                  borderBottomWidth: i < OTHER_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: theme.surfaceHigh,
                  alignItems: 'center', justifyContent: 'center', marginRight: 12,
                }}>
                  <Ionicons name={item.icon} size={18} color={theme.textSecondary} />
                </View>
                <Text style={{ color: theme.textPrimary, flex: 1, fontSize: 14, fontWeight: '500' }}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loggingOut}
            style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 16, paddingVertical: 14,
              backgroundColor: theme.surface, borderRadius: 18,
              borderWidth: 1, borderColor: theme.border,
            }}
          >
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: theme.error + '18',
              alignItems: 'center', justifyContent: 'center', marginRight: 12,
            }}>
              <Ionicons name="log-out-outline" size={18} color={theme.error} />
            </View>
            <Text style={{ color: theme.error, fontWeight: '600', fontSize: 14, flex: 1 }}>
              {loggingOut ? 'Signing out...' : 'Logout'}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 24 }}>
            2025 AITV · Ver 1.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
