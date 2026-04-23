import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '@/store/courseStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';

const TABS = ['About', 'Lessons', 'Discussions'] as const;
type Tab = typeof TABS[number];

const LESSONS = [
  { section: 'Section 1 - Preparation', items: ['Tools', 'Resources'] },
  { section: 'Section 2 - Core Concepts', items: ['Fundamentals', 'Deep Dive', 'Practice'] },
  { section: 'Section 3 - Advanced', items: ['Advanced Patterns', 'Real Project'] },
];
const LESSON_DURATIONS = ['3 Min', '5 Min', '8 Min', '12 Min', '10 Min', '15 Min', '20 Min'];

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { courses, toggleBookmark, enrollCourse, bookmarks } = useCourseStore();
  const { scheduleBookmarkMilestoneNotification } = useNotifications();
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('About');
  const [heroImgError, setHeroImgError] = useState(false);
  const [heroImgIndex, setHeroImgIndex] = useState(0);

  const course = courses.find((c) => c.id === id);
  const isBookmarked = course ? bookmarks.includes(course.id) : false;

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.textSecondary }}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const handleBookmark = async () => {
    await toggleBookmark(course.id);
    const newCount = bookmarks.length + (isBookmarked ? -1 : 1);
    if (newCount >= 5 && !isBookmarked) {
      await scheduleBookmarkMilestoneNotification(newCount);
    }
  };

  const handleEnroll = async () => {
    if (course.enrolled) { router.push(`/webview/${course.id}` as never); return; }
    setEnrolling(true);
    await new Promise((r) => setTimeout(r, 900));
    await enrollCourse(course.id);
    setEnrolling(false);
    Alert.alert('Enrolled!', `You are now enrolled in "${course.title}"`, [
      { text: 'Start Learning', onPress: () => router.push(`/webview/${course.id}` as never) },
      { text: 'Later', style: 'cancel' },
    ]);
  };

  let lessonIdx = 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 38, height: 38, backgroundColor: theme.surface, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBookmark}
          style={{
            width: 38, height: 38, borderRadius: 19,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: isBookmarked ? theme.primary : theme.surface,
            borderWidth: 1, borderColor: isBookmarked ? theme.primary : theme.border,
          }}
        >
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={20} color={isBookmarked ? '#fff' : theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thumbnail hero with image fallback chain */}
        <View style={{ marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
          {!heroImgError ? (
            <Image
              source={{ uri: course.images?.[heroImgIndex] ?? course.thumbnail }}
              style={{ width: '100%', height: 208 }}
              resizeMode="cover"
              onError={() => {
                const next = heroImgIndex + 1;
                if (course.images && next < course.images.length) {
                  setHeroImgIndex(next);
                } else {
                  setHeroImgError(true);
                }
              }}
            />
          ) : (
            <View style={{ width: '100%', height: 208, backgroundColor: theme.surfaceHigh, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="book-outline" size={48} color={theme.primary} />
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 8, textTransform: 'capitalize' }}>{course.category}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => router.push(`/webview/${course.id}` as never)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="play" size={18} color={theme.primary} style={{ marginLeft: 2 }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* Title + Price */}
          <Text style={{ color: theme.textPrimary, fontWeight: '800', fontSize: 20, lineHeight: 28, marginBottom: 6 }}>
            {course.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 18 }}>${course.price}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 14, textDecorationLine: 'line-through' }}>${Math.round(course.price * 1.5)}</Text>
          </View>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            {[1,2,3,4,5].map((i) => (
              <Ionicons key={i} name="star" size={14} color={theme.warning} style={{ marginRight: 1 }} />
            ))}
            <Text style={{ color: theme.textPrimary, fontWeight: '600', fontSize: 13, marginLeft: 6 }}>{course.rating.toFixed(1)}</Text>
            <Text style={{ color: theme.textMuted, fontSize: 12, marginLeft: 4 }}>(12,990)</Text>
          </View>

          {/* Stats bar */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
            backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 20,
            borderWidth: 1, borderColor: theme.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="people-outline" size={16} color={theme.primary} />
              <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: '600' }}>420</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>Members</Text>
            </View>
            <View style={{ width: 1, height: 28, backgroundColor: theme.border }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="book-outline" size={16} color={theme.primary} />
              <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: '600' }}>7</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>Lessons</Text>
            </View>
            <View style={{ width: 1, height: 28, backgroundColor: theme.border }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="ribbon-outline" size={16} color={theme.primary} />
              <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: '600' }}>Certificate</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.border, marginBottom: 20 }}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{ flex: 1, paddingBottom: 12, alignItems: 'center', position: 'relative' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: activeTab === tab ? theme.primary : theme.textSecondary }}>
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View style={{ position: 'absolute', bottom: 0, width: 32, height: 2.5, backgroundColor: theme.primary, borderRadius: 2 }} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* About Tab */}
          {activeTab === 'About' && (
            <View>
              <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 8 }}>About this class</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 22, marginBottom: 16 }}>{course.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: theme.border }}>
                <Image source={{ uri: course.instructor.avatar }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, marginBottom: 2 }}>Mentor</Text>
                  <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 14 }}>{course.instructor.name}</Text>
                  <Text style={{ color: theme.primary, fontSize: 12, textTransform: 'capitalize', marginTop: 1 }}>{course.instructor.expertise}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Lessons Tab */}
          {activeTab === 'Lessons' && (
            <View>
              {LESSONS.map((section) => (
                <View key={section.section} style={{ marginBottom: 20 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {section.section}
                  </Text>
                  {section.items.map((item) => {
                    const idx = lessonIdx++;
                    const duration = LESSON_DURATIONS[idx % LESSON_DURATIONS.length];
                    return (
                      <View
                        key={item}
                        style={{
                          flexDirection: 'row', alignItems: 'center',
                          padding: 14, borderRadius: 12, marginBottom: 8,
                          backgroundColor: theme.surface,
                          borderWidth: 1, borderColor: theme.border,
                        }}
                      >
                        <View style={{ width: 30, height: 30, borderRadius: 15, marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceHigh }}>
                          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.textPrimary }}>{item}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                            <Ionicons name="videocam-outline" size={12} color={theme.textMuted} />
                            <Text style={{ fontSize: 11, color: theme.textMuted }}>Video · {duration}</Text>
                          </View>
                        </View>
                        {!course.enrolled && (
                          <Ionicons name="lock-closed-outline" size={14} color={theme.textMuted} />
                        )}
                        {course.enrolled && (
                          <Ionicons name="play-circle-outline" size={16} color={theme.primary} />
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {/* Discussions Tab */}
          {activeTab === 'Discussions' && (
            <View>
              {[
                { user: 'Kai Havertz', time: '3 days ago', msg: 'How do I create components properly?', reply: true },
                { user: 'Leslie Alexander', time: '3 days ago', msg: 'Great course! Very well explained.', reply: false },
              ].map((d) => (
                <View key={d.user} style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: theme.primary + '30', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>{d.user[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.textPrimary, fontSize: 13, fontWeight: '600' }}>{d.user}</Text>
                      <Text style={{ color: theme.textMuted, fontSize: 11 }}>{d.time}</Text>
                    </View>
                  </View>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: d.reply ? 10 : 0 }}>{d.msg}</Text>
                  {d.reply && (
                    <View style={{ backgroundColor: theme.background, borderRadius: 10, padding: 12, marginLeft: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ color: theme.textPrimary, fontSize: 12, fontWeight: '700', marginRight: 6 }}>{course.instructor.name}</Text>
                        <View style={{ backgroundColor: theme.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          <Text style={{ color: '#fff', fontSize: 10 }}>Mentor</Text>
                        </View>
                      </View>
                      <Text style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 18 }}>
                        You can create components by right-clicking and selecting component from the navbar.
                      </Text>
                      <TouchableOpacity>
                        <Text style={{ color: theme.primary, fontSize: 12, marginTop: 6 }}>2 Replies</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Enroll / Continue Button */}
          <TouchableOpacity
            onPress={handleEnroll}
            disabled={enrolling}
            style={{
              paddingVertical: 16, borderRadius: 18,
              alignItems: 'center', marginBottom: 32, marginTop: 8,
              backgroundColor: course.enrolled ? theme.success : theme.primary,
              opacity: enrolling ? 0.6 : 1,
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}
          >
            {course.enrolled && <Ionicons name="play" size={16} color="#fff" />}
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
              {enrolling ? 'Enrolling...' : course.enrolled ? 'Continue Learning' : `Enroll  —  $${course.price}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
