import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { NOTIFICATION_IDS } from "@/constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const setupNotificationChannels = async (): Promise<void> => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("bookmarks", {
      name: "Bookmark Updates",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Learning Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }
};

export const scheduleBookmarkMilestoneNotification = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.BOOKMARK_MILESTONE
  );

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.BOOKMARK_MILESTONE,
    content: {
      title: "You're on a roll! 🎯",
      body: "You've bookmarked 5 courses. Ready to start learning?",
      data: { screen: "/(tabs)/bookmarks" },
      sound: "default",
    },
    trigger: null,
  });
};

export const scheduleReengagementNotification = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.REENGAGEMENT
  );

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDS.REENGAGEMENT,
    content: {
      title: "Miss learning? 📚",
      body: "Your courses are waiting. Pick up where you left off!",
      data: { screen: "/(tabs)/index" },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24,
      repeats: false,
    },
  });
};

export const cancelReengagementNotification = async (): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDS.REENGAGEMENT
  );
};
