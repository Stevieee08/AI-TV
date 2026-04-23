import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await register(data.username, data.email, data.password);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      Alert.alert('Registration Failed', err instanceof Error ? err.message : 'Please try again.');
    } finally { setLoading(false); }
  };

  const fields: { name: keyof RegisterForm; label: string; placeholder: string; secure?: boolean; keyboard?: 'email-address' | 'default' }[] = [
    { name: 'username', label: 'Username', placeholder: 'johndoe' },
    { name: 'email', label: 'Email', placeholder: 'you@example.com', keyboard: 'email-address' },
    { name: 'password', label: 'Password', placeholder: '••••••••', secure: true },
    { name: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', secure: true },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: theme.primary, marginBottom: 4 }}>AITV</Text>
            <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: '700' }}>Create account</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>Start your learning journey</Text>
          </View>

          {fields.map((field) => (
            <View key={field.name} style={{ marginBottom: 18 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8, fontWeight: '500' }}>{field.label}</Text>
              <Controller control={control} name={field.name} render={({ field: { onChange, value } }) => (
                <TextInput style={{ backgroundColor: theme.surface, color: theme.textPrimary, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: theme.border, fontSize: 14 }} placeholder={field.placeholder} placeholderTextColor={theme.textSecondary} secureTextEntry={field.secure} keyboardType={field.keyboard || 'default'} autoCapitalize="none" value={value} onChangeText={onChange} />
              )} />
              {errors[field.name] && <Text style={{ color: theme.error, fontSize: 12, marginTop: 4 }}>{errors[field.name]?.message}</Text>}
            </View>
          ))}

          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={{ backgroundColor: theme.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8, marginBottom: 16, opacity: loading ? 0.6 : 1 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 14 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
