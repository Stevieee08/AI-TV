import React, { useCallback } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '@/store/courseStore';
import { CourseCard } from '@/components/course/CourseCard';
import { useTheme } from '@/hooks/useTheme';
import { Course } from '@/types';

export default function BookmarkScreen() {
  const { theme, isDark } = useTheme();
  const getBookmarkedCourses = useCourseStore((s) => s.getBookmarkedCourses);
  const bookmarks = useCourseStore((s) => s.bookmarks);
  const bookmarked = getBookmarkedCourses();

  const renderItem = useCallback(({ item }: { item: Course }) => <CourseCard course={item} />, [bookmarks]);
  const keyExtractor = useCallback((item: Course) => item.id, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: '800' }}>Bookmarks</Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
          {bookmarked.length} saved {bookmarked.length === 1 ? 'course' : 'courses'}
        </Text>
      </View>

      <FlatList
        data={bookmarked}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        extraData={bookmarks}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 96 }}>
            <Ionicons name="bookmark-outline" size={56} color={theme.textMuted} />
            <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 16 }}>
              No bookmarks yet
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 32 }}>
              Tap the bookmark icon on any course to save it here
            </Text>
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
