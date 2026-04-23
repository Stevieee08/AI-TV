import React from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '@/store/courseStore';
import { CourseCard } from '@/components/course/CourseCard';
import { useTheme } from '@/hooks/useTheme';
import { Course } from '@/types';

export default function MyCoursesScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const getEnrolledCourses = useCourseStore((s) => s.getEnrolledCourses);
  const enrolled = getEnrolledCourses();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: theme.border }}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 17 }}>My Courses</Text>
      </View>
      <FlatList
        data={enrolled}
        keyExtractor={(item: Course) => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 96 }}>
            <Ionicons name="school-outline" size={56} color={theme.textMuted} />
            <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 16 }}>No courses yet</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 }}>Enroll in a course to see it here</Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)' as never)} style={{ backgroundColor: theme.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14, marginTop: 20 }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
