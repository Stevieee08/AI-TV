import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, Alert, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '@/lib/api';
import { storageGet, storageSet } from '@/lib/secureStorage';

const profileSchema = z.object({
  username: z.string().min(3, 'Minimum 3 characters'),
});
const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Min 6 characters'),
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?._id) {
      storageGet<string>(`aitv_local_avatar_${user._id}`).then((v) => { if (v) setLocalAvatar(v); });
    }
  }, [user?._id]);

  const avatarUri = localAvatar || user?.avatar?.url;

  const {
    control: pControl, handleSubmit: pSubmit,
    formState: { errors: pErrors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: user?.username || '' },
  });

  const {
    control: passControl, handleSubmit: passSubmit,
    formState: { errors: passErrors }, reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handleAvatarPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library in Settings to change your profile picture.'
      );
      return;
    }
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

  const onSaveProfile = async (data: ProfileForm) => {
    setSavingProfile(true);
    try {
      try {
        const res = await apiClient.patch('/api/v1/users/update-profile', { username: data.username });
        updateUser(res.data.data.user);
      } catch {
        // For guest/offline: update locally in store + AsyncStorage
        if (user) updateUser({ ...user, username: data.username });
      }
      Alert.alert('Updated', 'Username saved successfully.');
    } catch {
      Alert.alert('Error', 'Could not update username.');
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePassword = async (data: PasswordForm) => {
    setSavingPassword(true);
    try {
      await apiClient.post('/api/v1/users/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      reset();
      Alert.alert('Updated', 'Password changed successfully.');
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Could not change password. Check your current password and try again.';
      Alert.alert('Error', msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const inputBg = {
    backgroundColor: theme.background,
    color: theme.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    fontSize: 14,
  };

  const passwordFields = [
    { name: 'oldPassword' as const, label: 'Current Password', show: showOld, toggle: () => setShowOld(!showOld) },
    { name: 'newPassword' as const, label: 'New Password', show: showNew, toggle: () => setShowNew(!showNew) },
    { name: 'confirmPassword' as const, label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 38, height: 38, backgroundColor: theme.surface,
            borderRadius: 12, alignItems: 'center', justifyContent: 'center',
            marginRight: 12, borderWidth: 1, borderColor: theme.border,
          }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>Edit Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* Avatar picker */}
        <View style={{ alignItems: 'center', marginBottom: 28, marginTop: 8 }}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.85} style={{ position: 'relative' }}>
            <View style={{
              width: 90, height: 90, borderRadius: 45,
              overflow: 'hidden', borderWidth: 3,
              borderColor: theme.primary + '50', marginBottom: 10,
            }}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 90, height: 90 }} resizeMode="cover" />
              ) : (
                <View style={{ flex: 1, backgroundColor: theme.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 34, fontWeight: '700', color: theme.primary }}>
                    {user?.username?.[0]?.toUpperCase() ?? 'G'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{
              position: 'absolute', bottom: 10, right: 0,
              backgroundColor: theme.primary, borderRadius: 12,
              width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2.5, borderColor: theme.background,
            }}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{user?.email}</Text>
        </View>

        {/* Username section */}
        <Text style={{
          color: theme.textSecondary, fontSize: 11, fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
        }}>
          Edit Username
        </Text>
        <View style={{
          backgroundColor: theme.surface, borderRadius: 18,
          padding: 16, marginBottom: 20,
          borderWidth: 1, borderColor: theme.border,
        }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>Username</Text>
          <Controller
            control={pControl}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{ ...inputBg, marginBottom: 12 }}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                placeholderTextColor={theme.textSecondary}
                placeholder="Enter username"
              />
            )}
          />
          {pErrors.username && (
            <Text style={{ color: theme.error, fontSize: 12, marginBottom: 10 }}>
              {pErrors.username.message}
            </Text>
          )}
          <TouchableOpacity
            onPress={pSubmit(onSaveProfile)}
            disabled={savingProfile}
            style={{
              backgroundColor: theme.primary, paddingVertical: 13,
              borderRadius: 12, alignItems: 'center',
              opacity: savingProfile ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
              {savingProfile ? 'Saving...' : 'Save Username'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password section */}
        <Text style={{
          color: theme.textSecondary, fontSize: 11, fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
        }}>
          Change Password
        </Text>
        <View style={{
          backgroundColor: theme.surface, borderRadius: 18,
          padding: 16, marginBottom: 32,
          borderWidth: 1, borderColor: theme.border,
        }}>
          {passwordFields.map((f) => (
            <View key={f.name} style={{ marginBottom: 14 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 6 }}>{f.label}</Text>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: theme.background,
                borderWidth: 1, borderColor: theme.border,
                borderRadius: 12, paddingHorizontal: 14,
              }}>
                <Controller
                  control={passControl}
                  name={f.name}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={{ flex: 1, color: theme.textPrimary, paddingVertical: 12, fontSize: 14 }}
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!f.show}
                      autoCapitalize="none"
                      placeholderTextColor={theme.textSecondary}
                      placeholder="••••••••"
                    />
                  )}
                />
                <TouchableOpacity onPress={f.toggle} style={{ padding: 4 }}>
                  <Ionicons
                    name={f.show ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passErrors[f.name] && (
                <Text style={{ color: theme.error, fontSize: 12, marginTop: 4 }}>
                  {passErrors[f.name]?.message}
                </Text>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={passSubmit(onSavePassword)}
            disabled={savingPassword}
            style={{
              backgroundColor: theme.primary, paddingVertical: 13,
              borderRadius: 12, alignItems: 'center',
              marginTop: 4, opacity: savingPassword ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
              {savingPassword ? 'Updating...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
