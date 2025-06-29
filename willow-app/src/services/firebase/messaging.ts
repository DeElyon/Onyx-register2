iimport { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { auth } from './auth';
import { db } from './firestore';

const messaging = getMessaging();

// Configure push notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(userId: string) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  // Get Expo push token
  const expoToken = (await Notifications.getExpoPushTokenAsync()).data;

  // Get Firebase FCM token
  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.EXPO_PUBLIC_FCM_KEY,
  });

  // Save both tokens to user profile
  await updateDoc(doc(db, 'users', userId), {
    pushTokens: {
      expo: expoToken,
      fcm: fcmToken
    }
  });

  // Handle foreground notifications
  onMessage(messaging, (payload) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: payload.notification?.title,
        body: payload.notification?.body,
        data: payload.data,
      },
      trigger: null, // Show immediately
    });
  });
}

export async function sendPushNotification({
  userId,
  title,
  body,
  data
}: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  // In production, call a Cloud Function to send the notification
  console.log(Would send push to ${userId}:, { title, body, data });
}
