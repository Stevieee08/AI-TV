import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <Ionicons name="alert-circle-outline" size={56} color={theme.textMuted} />
      <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17, marginTop: 20, marginBottom: 8, textAlign: 'center' }}>
        Something went wrong
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 22 }}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={{ backgroundColor: theme.primary, paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Retry</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
