import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, RefreshControl,
  TouchableOpacity, StatusBar, Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '@/hooks/useCourses';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';
import { CourseCard } from '@/components/course/CourseCard';
import { CourseCardSkeleton } from '@/components/course/CourseCardSkeleton';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ErrorView } from '@/components/ui/ErrorView';
import { useTheme } from '@/hooks/useTheme';
import { ContinueLessons } from '@/components/ui/ContinueLessons';
import { Course } from '@/types';

const CATEGORIES = ['All', 'smartphones', 'laptops', 'fragrances', 'skincare'];
const CATEGORY_LABELS: Record<string, string> = {
  All: 'All',
  smartphones: 'Mobile',
  laptops: 'Laptops',
  fragrances: 'Fragrance',
  skincare: 'Skincare',
};
const CATEGORY_MAP: Record<string, string> = {};

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { isLoading, isError, refetch, isFetching } = useCourses();
  const courses = useCourseStore((s) => s.courses);
  const user = useAuthStore((s) => s.user);
  const getEnrolledCourses = useCourseStore((s) => s.getEnrolledCourses);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  const enrolled = getEnrolledCourses();
  const continueLesson = enrolled[0] ?? null;

  const allInstructors = useMemo(() => {
    const seen = new Set<string>();
    return courses.filter((c) => {
      if (seen.has(c.instructor.id)) return false;
      seen.add(c.instructor.id);
      return true;
    });
  }, [courses]);

  const filtered = useMemo(() => {
    let result = courses;
    if (activeCategory !== 'All') {
      const mapped = CATEGORY_MAP[activeCategory] ?? activeCategory;
      result = result.filter((c) => c.category === mapped);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, search, activeCategory]);

  const renderItem = useCallback(({ item }: { item: Course }) => <CourseCard course={item} />, []);
  const keyExtractor = useCallback((item: Course) => item.id, []);

  if (isError) {
    return <ErrorView message="Failed to load courses. Check your connection." onRetry={() => refetch()} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <OfflineBanner />

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                  Hello, {user?.username ?? 'Learner'} 👋
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 2 }}>
                  Find Your <Text style={{ color: theme.primary }}>Best</Text>
                </Text>
                <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>
                  Online Course 🔥
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/profile/notifications' as never)}
                style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center',
                  marginLeft: 12, borderWidth: 1, borderColor: theme.border,
                }}
              >
                <Ionicons name="notifications-outline" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: theme.surface, borderRadius: 16,
              paddingHorizontal: 14, marginBottom: 20,
              borderWidth: 1, borderColor: theme.border,
            }}>
              <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
              <TextInput
                style={{ flex: 1, color: theme.textPrimary, paddingVertical: 14, paddingHorizontal: 10, fontSize: 14 }}
                placeholder="Search courses, mentors..."
                placeholderTextColor={theme.textSecondary}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {enrolled.length > 0 && (
              <ContinueLessons enrolled={enrolled} theme={theme} />
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8,
                    backgroundColor: activeCategory === cat ? theme.primary : theme.surface,
                    borderWidth: 1, borderColor: activeCategory === cat ? theme.primary : theme.border,
                  }}
                >
                  <Text style={{
                    fontSize: 12, fontWeight: '600',
                    color: activeCategory === cat ? '#fff' : theme.textSecondary,
                  }}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {allInstructors.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 14 }}>
                  Popular <Text style={{ color: theme.primary }}>Mentors</Text>
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {allInstructors.map((c) => (
                    <TouchableOpacity
                      key={c.instructor.id}
                      onPress={() => router.push(`/course/${c.id}` as never)}
                      activeOpacity={0.8}
                      style={{ alignItems: 'center', marginRight: 20 }}
                    >
                      <View style={{
                        width: 68, height: 68, borderRadius: 34, overflow: 'hidden',
                        borderWidth: 2.5, borderColor: theme.border, marginBottom: 6,
                      }}>
                        <Image source={{ uri: c.instructor.avatar }} style={{ width: 68, height: 68 }} resizeMode="cover" />
                      </View>
                      <Text style={{ color: theme.textSecondary, fontSize: 12, width: 68, textAlign: 'center', fontWeight: '500' }} numberOfLines={1}>
                        {c.instructor.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginBottom: 12 }}>
              Recommendation
            </Text>

            {isLoading && (
              <View>{Array(4).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)}</View>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
              <Ionicons name="search-outline" size={48} color={theme.textMuted} />
              <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 14, marginBottom: 6 }}>
                No courses found
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                Try a different search or category
              </Text>
            </View>
          ) : null
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
