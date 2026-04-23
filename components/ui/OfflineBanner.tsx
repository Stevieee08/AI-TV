import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '@/hooks/useNetwork';

export function OfflineBanner() {
  const { isOffline } = useNetwork();
  if (!isOffline) return null;
  return (
    <View style={{ backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Ionicons name="wifi-outline" size={14} color="#fff" />
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
        No internet — showing cached content
      </Text>
    </View>
  );
}
