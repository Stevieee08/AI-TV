import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types';
import { useCourseStore } from '@/store/courseStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';

interface CourseCardProps {
  course: Course;
}

const CATEGORY_CONFIG: Record<string, { top: string; bottom: string; icon: Parameters<typeof Ionicons>[0]['name'] }> = {
  smartphones:       { top: '#1E3A8A', bottom: '#3D5AFE', icon: 'phone-portrait-outline' },
  laptops:           { top: '#4C1D95', bottom: '#7C3AED', icon: 'laptop-outline' },
  fragrances:        { top: '#831843', bottom: '#DB2777', icon: 'color-palette-outline' },
  skincare:          { top: '#064E3B', bottom: '#059669', icon: 'leaf-outline' },
  groceries:         { top: '#78350F', bottom: '#D97706', icon: 'basket-outline' },
  'home-decoration': { top: '#7F1D1D', bottom: '#DC2626', icon: 'home-outline' },
};
const DEFAULT_CONFIG = { top: '#1E3A8A', bottom: '#3D5AFE', icon: 'book-outline' as Parameters<typeof Ionicons>[0]['name'] };

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { toggleBookmark, bookmarks } = useCourseStore();
  const { scheduleBookmarkMilestoneNotification } = useNotifications();
  const [imgFailed, setImgFailed] = useState(false);
  const [tryIdx, setTryIdx] = useState(0);

  const isBookmarked = bookmarks.includes(course.id);
  const cfg = CATEGORY_CONFIG[course.category] ?? DEFAULT_CONFIG;

  const handleBookmark = async () => {
    await toggleBookmark(course.id);
    const newCount = bookmarks.length + (isBookmarked ? -1 : 1);
    if (newCount >= 5 && !isBookmarked) await scheduleBookmarkMilestoneNotification(newCount);
  };

  const handleImgError = () => {
    const next = tryIdx + 1;
    if (course.images && next < course.images.length) setTryIdx(next);
    else setImgFailed(true);
  };

  const imgUri = course.images?.[tryIdx] ?? course.thumbnail;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/course/${course.id}` as never)}
      style={{ backgroundColor: theme.surface, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.border }}
      activeOpacity={0.88}
    >
      <View style={{ height: 176 }}>
        {!imgFailed && imgUri ? (
          <Image
            source={{ uri: imgUri }}
            style={{ width: '100%', height: 176 }}
            resizeMode="cover"
            onError={handleImgError}
          />
        ) : (
          <View style={{ width: '100%', height: 176, backgroundColor: cfg.bottom, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: cfg.top, opacity: 0.5 }} />
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Ionicons name={cfg.icon} size={30} color="rgba(255,255,255,0.95)" />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', textTransform: 'capitalize' }}>
              {course.category.replace('-', ' ')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleBookmark}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: 18,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: isBookmarked ? theme.primary : 'rgba(0,0,0,0.45)',
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={18} color="#fff" />
        </TouchableOpacity>

        {course.enrolled && (
          <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: theme.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Enrolled</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 14 }}>
        <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4, lineHeight: 20 }} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 18, marginBottom: 10 }} numberOfLines={2}>
          {course.description}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Image source={{ uri: course.instructor.avatar }} style={{ width: 22, height: 22, borderRadius: 11, marginRight: 7 }} resizeMode="cover" />
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{course.instructor.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={13} color={theme.warning} />
            <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: '600' }}>{course.rating.toFixed(1)}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 4 }}>· {course.duration}</Text>
          </View>
          <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 14 }}>${course.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prev, next) =>
  prev.course.id === next.course.id &&
  prev.course.bookmarked === next.course.bookmarked &&
  prev.course.enrolled === next.course.enrolled &&
  prev.course.thumbnail === next.course.thumbnail
);
