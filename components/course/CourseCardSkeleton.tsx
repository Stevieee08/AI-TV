import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function CourseCardSkeleton() {
  const { theme } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View style={{ opacity, backgroundColor: theme.surface, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.border }}>
      <View style={{ width: '100%', height: 176, backgroundColor: theme.surfaceHigh }} />
      <View style={{ padding: 14 }}>
        <View style={{ width: '75%', height: 18, backgroundColor: theme.surfaceHigh, borderRadius: 8, marginBottom: 8 }} />
        <View style={{ width: '100%', height: 13, backgroundColor: theme.surfaceHigh, borderRadius: 6, marginBottom: 5 }} />
        <View style={{ width: '65%', height: 13, backgroundColor: theme.surfaceHigh, borderRadius: 6, marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: theme.surfaceHigh, marginRight: 8 }} />
          <View style={{ width: 100, height: 11, backgroundColor: theme.surfaceHigh, borderRadius: 5 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 80, height: 13, backgroundColor: theme.surfaceHigh, borderRadius: 5 }} />
          <View style={{ width: 44, height: 13, backgroundColor: theme.surfaceHigh, borderRadius: 5 }} />
        </View>
      </View>
    </Animated.View>
  );
}
