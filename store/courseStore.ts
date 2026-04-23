import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { useAuthStore } from './authStore';

// Helper functions to get user-specific storage keys
const getUserBookmarksKey = (userId: string) => `${STORAGE_KEYS.BOOKMARKS}_${userId}`;
const getUserEnrolledKey = (userId: string) => `${STORAGE_KEYS.ENROLLED_COURSES}_${userId}`;

interface CourseStore {
  courses: Course[];
  bookmarks: string[];
  enrolled: string[];
  setCourses: (courses: Course[]) => void;
  toggleBookmark: (courseId: string) => Promise<void>;
  enrollCourse: (courseId: string) => Promise<void>;
  loadPersistedData: () => Promise<void>;
  clearUserData: () => Promise<void>;
  reapplyCourseStatus: () => void;
  getBookmarkedCourses: () => Course[];
  getEnrolledCourses: () => Course[];
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrolled: [],

  setCourses: (courses) => {
    const { bookmarks, enrolled } = get();
    const merged = courses.map((c) => ({
      ...c,
      bookmarked: bookmarks.includes(c.id),
      enrolled: enrolled.includes(c.id),
    }));
    set({ courses: merged });
  },

  toggleBookmark: async (courseId) => {
    const { bookmarks, courses } = get();
    const authStore = useAuthStore.getState();
    const userId = authStore.user?._id;
    
    if (!userId) return;
    
    const isBookmarked = bookmarks.includes(courseId);
    const updated = isBookmarked
      ? bookmarks.filter((id) => id !== courseId)
      : [...bookmarks, courseId];

    await AsyncStorage.setItem(getUserBookmarksKey(userId), JSON.stringify(updated));

    set({
      bookmarks: updated,
      courses: courses.map((c) =>
        c.id === courseId ? { ...c, bookmarked: !isBookmarked } : c
      ),
    });
  },

  enrollCourse: async (courseId) => {
    const { enrolled, courses } = get();
    const authStore = useAuthStore.getState();
    const userId = authStore.user?._id;
    
    if (!userId || enrolled.includes(courseId)) return;
    const updated = [...enrolled, courseId];

    await AsyncStorage.setItem(getUserEnrolledKey(userId), JSON.stringify(updated));

    set({
      enrolled: updated,
      courses: courses.map((c) =>
        c.id === courseId ? { ...c, enrolled: true } : c
      ),
    });
  },

  loadPersistedData: async () => {
    const authStore = useAuthStore.getState();
    const userId = authStore.user?._id;
    
    if (!userId) {
      set({ bookmarks: [], enrolled: [] });
      return;
    }
    
    const bookmarksRaw = await AsyncStorage.getItem(getUserBookmarksKey(userId));
    const enrolledRaw = await AsyncStorage.getItem(getUserEnrolledKey(userId));

    const bookmarks = bookmarksRaw ? JSON.parse(bookmarksRaw) as string[] : [];
    const enrolled = enrolledRaw ? JSON.parse(enrolledRaw) as string[] : [];

    set({ bookmarks, enrolled });
  },

  clearUserData: async () => {
    // Only clear from memory, keep data in AsyncStorage for when user logs back in
    set({ bookmarks: [], enrolled: [] });
  },

  reapplyCourseStatus: () => {
    const { courses, bookmarks, enrolled } = get();
    const updated = courses.map((c) => ({
      ...c,
      bookmarked: bookmarks.includes(c.id),
      enrolled: enrolled.includes(c.id),
    }));
    set({ courses: updated });
  },

  getBookmarkedCourses: () => {
    const { courses } = get();
    return courses.filter((c) => c.bookmarked);
  },

  getEnrolledCourses: () => {
    const { courses } = get();
    return courses.filter((c) => c.enrolled);
  },
}));
