import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, NOTIFICATION_IDS } from '@/constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'AITV Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366f1',
      });
    }
  };

  const scheduleBookmarkMilestoneNotification = async (count: number) => {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.BOOKMARK_MILESTONE,
      content: {
        title: '🎯 Nice collection!',
        body: `You've bookmarked ${count} courses. Ready to start learning?`,
        data: { type: 'bookmark' },
      },
      trigger: null,
    });
  };

  const scheduleDailyReminderNotification = async () => {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.DAILY_REMINDER);

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.DAILY_REMINDER,
      content: {
        title: '📚 Miss learning?',
        body: "Your courses are waiting for you. Pick up where you left off!",
        data: { type: 'reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 86400,
        repeats: false,
      },
    });
  };

  const checkAndScheduleReminder = async () => {
    const lastOpened = await AsyncStorage.getItem(STORAGE_KEYS.LAST_OPENED);
    if (!lastOpened) return;

    const lastDate = new Date(lastOpened);
    const now = new Date();
    const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      await scheduleDailyReminderNotification();
    }
  };

  return {
    scheduleBookmarkMilestoneNotification,
    scheduleDailyReminderNotification,
    checkAndScheduleReminder,
  };
}
