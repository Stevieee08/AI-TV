import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Course } from '@/types';

const CARD_W = Dimensions.get('window').width - 32;

interface Props {
  enrolled: Course[];
  theme: {
    primary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
}

const progressCache: Record<string, number> = {};
function getProgress(id: string): number {
  if (!progressCache[id]) progressCache[id] = Math.floor(Math.random() * 55) + 20;
  return progressCache[id];
}

export function ContinueLessons({ enrolled, theme }: Props) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CARD_W);
    setActiveIdx(Math.max(0, Math.min(idx, enrolled.length - 1)));
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 12 }}>
        Continue Your <Text style={{ color: theme.primary }}>Lessons</Text>
      </Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={CARD_W}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: 0 }}
      >
        {enrolled.map((lesson) => {
          const pct = getProgress(lesson.id);
          return (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => router.push(`/webview/${lesson.id}` as never)}
              activeOpacity={0.88}
              style={{
                width: CARD_W,
                backgroundColor: theme.primary,
                borderRadius: 18,
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginRight: 14 }}>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Continue learning
                </Text>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14, marginBottom: 5, lineHeight: 20 }} numberOfLines={2}>
                  {lesson.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginBottom: 10 }}>
                  {lesson.instructor.name}
                </Text>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 5, height: 5 }}>
                  <View style={{ backgroundColor: '#fff', height: 5, width: `${pct}%`, borderRadius: 5 }} />
                </View>
              </View>
              <View style={{
                width: 52, height: 52, borderRadius: 26,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>{pct}%</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {enrolled.length > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, alignItems: 'center' }}>
          {enrolled.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIdx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === activeIdx ? theme.primary : theme.border,
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
