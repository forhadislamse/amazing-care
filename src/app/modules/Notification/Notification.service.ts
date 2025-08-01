// Notification.service: Module file for the Notification.service functionality.

import admin from './firebaseAdmin';
import prisma from '../../../shared/prisma';

const sendNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  userId: any,
) => {
  const message = {
    notification: { title, body },
    token: deviceToken,
  };

  console.log(message);

  try {
    const test = await admin.messaging().send(message);
    console.log(test);

    await prisma.notification.create({
      data: {
        title,
        body,
        userId,
      },
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const getAllNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' }});
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const getNotificationByUserId = async (userId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications by user ID:', error);
    throw error;
  }
};

const readNotificationByUserId = async (userId: string) => {
  try {
    const notifications = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return notifications;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

const sendNotificationToGroupIntoDb = async (notificationData: { 
  title: string,
  body: string,
  users: string[] 
}) => {
  const { title, body, users } = notificationData;

  const notifications = users.map(async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (user?.fcmToken) {
      const message = {
        notification: { title, body },
        token: user.fcmToken,
      };

      try {
        await admin.messaging().send(message);
      } catch (error) {
      }
    }

    return prisma.notification.create({
      data: {
        title,
        body,
        userId,
      },
    });
  });

  await Promise.all(notifications);
  return { message: "Notifications sent successfully" };
};

export const notificationService = {
  sendNotification,
  getAllNotifications,
  getNotificationByUserId,
  readNotificationByUserId,
  sendNotificationToGroupIntoDb,
};