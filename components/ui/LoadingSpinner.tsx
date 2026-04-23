import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#6366f1" />
      {message && (
        <Text className="text-textSecondary text-sm mt-4">{message}</Text>
      )}
    </View>
  );
}
