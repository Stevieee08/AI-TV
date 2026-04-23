import React, { useCallback } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '@/store/courseStore';
import { useTheme } from '@/hooks/useTheme';
import { CourseCard } from '@/components/course/CourseCard';
import { Course } from '@/types';

export default function MyCoursesTabScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const getEnrolledCourses = useCourseStore((s) => s.getEnrolledCourses);
  const courses = useCourseStore((s) => s.courses);
  const enrolled = getEnrolledCourses();

  const renderItem = useCallback(({ item }: { item: Course }) => <CourseCard course={item} />, [courses]);
  const keyExtractor = useCallback((item: Course) => item.id, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>My Courses</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 3 }}>
          {enrolled.length} {enrolled.length === 1 ? 'course' : 'courses'} enrolled
        </Text>
      </View>

      <FlatList
        data={enrolled}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        extraData={courses}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
            <Ionicons name="book-outline" size={64} color={theme.textMuted} />
            <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 16 }}>
              No courses yet
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 }}>
              Enroll in a course to see it here
            </Text>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)' as never)}
              style={{ backgroundColor: theme.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 20 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
