import { useState } from 'react';
import { GetNotification, UpdateNotificationRead } from '../api';
import type { INotification, INotificationReadRequest } from '../types';

export const useNotification = () => {
  // Fetch Notification Unread
  const [isNotificationFetching, setIsNotificationFetching] = useState<boolean>(false);
  const [notificationList, setNotificationList] = useState<INotification[] | null>(null);

  const fetchNotification = () => {
    setIsNotificationFetching(true);
    GetNotification()
      .then((res) => {
        setNotificationList(res?.data);
        setIsNotificationFetching(false);
      })
      .catch(() => {
        setIsNotificationFetching(false);
      });
  };

  // Push Notification (for SSE)
  const pushNotification = ({ id, message, notification_type, automation_id }: Partial<INotification>) => {
    setNotificationList((prev) => {
      const isExisting = prev?.find(
        (notification) =>
          notification.automation_id === automation_id && notification.notification_type === notification_type
      );
      if (isExisting) return prev;
      const newItem = { id, message, notification_type, automation_id } as INotification;
      if (!prev) return [newItem];
      return [newItem, ...prev];
    });
  };

  // Read (remove) Notification from list
  const readNotification = (notificationId: string) => {
    setNotificationList((prev) => {
      if (!prev) return prev;
      return prev.filter((n) => n.id !== notificationId);
    });
  };

  // Mark Notification as Read
  const [isNotificationMarking, setIsNotificationMarking] = useState<boolean>(false);

  const markNotificationAsRead = (
    updateNotificationReadpaylod: INotificationReadRequest,
    onComplete: (status: string) => void
  ) => {
    setIsNotificationMarking(true);
    UpdateNotificationRead(updateNotificationReadpaylod)
      .then(() => {
        setIsNotificationMarking(false);
        readNotification(updateNotificationReadpaylod.id);
        onComplete('success');
      })
      .catch(() => {
        setIsNotificationMarking(false);
        onComplete('failure');
      });
  };

  return {
    // Fetch Notification Unread
    isNotificationFetching,
    notificationList,
    fetchNotification,

    // Push Notification (for SSE)
    pushNotification,

    // Read (remove) Notification from list
    readNotification,

    // Mark Notification as Read
    isNotificationMarking,
    markNotificationAsRead,
  };
};
