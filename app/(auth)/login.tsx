import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      Alert.alert(
        'Login Failed',
        err instanceof Error ? err.message : 'Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: theme.surface,
    color: theme.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    fontSize: 14,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32 }}>

          <View style={{ marginBottom: 36 }}>
            <Text style={{ fontSize: 38, fontWeight: '800', color: theme.primary, marginBottom: 6 }}>AITV</Text>
            <Text style={{ color: theme.textPrimary, fontSize: 26, fontWeight: '700' }}>Welcome back</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
              Sign in to continue your learning journey
            </Text>
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8, fontWeight: '600' }}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={inputStyle}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: theme.error, fontSize: 12, marginTop: 4 }}>{errors.email.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 28 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8, fontWeight: '600' }}>Password</Text>
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={{ ...inputStyle, paddingRight: 50 }}
                    placeholder="••••••••"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: 14 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={{ color: theme.error, fontSize: 12, marginTop: 4 }}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            style={{
              backgroundColor: theme.primary,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginBottom: 24,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as never)}>
              <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 14 }}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
