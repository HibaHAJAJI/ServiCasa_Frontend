import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import notificationSocketService from "../../services/notificationService";
import { isNotificationAllowedForRole } from "../../config/notificationTypes";
import { getRole, isNotificationRecipient } from "../../lib/roles";
import NotificationContext from "./NotificationContext";

let notificationCounter = 0;
const nextNotificationId = () => {
  notificationCounter += 1;
  return `notification-${Date.now()}-${notificationCounter}`;
};

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const role = getRole(user);
  const canReceiveNotifications = isNotificationRecipient(user);

  const [notifications, setNotifications] = useState([]);
  const [recipientKey, setRecipientKey] = useState(null);

  const currentRecipientKey = canReceiveNotifications && token ? `${role}:${token}` : null;

  if (currentRecipientKey !== recipientKey) {
    setRecipientKey(currentRecipientKey);
    setNotifications([]);
  }

  useEffect(() => {
    if (!currentRecipientKey) {
      notificationSocketService.disconnect();
      return;
    }

    notificationSocketService.connect(token, (incoming) => {
      if (!isNotificationAllowedForRole(incoming?.type, role)) {
        return;
      }

      const notification = {
        ...incoming,
        id: incoming?.id ?? nextNotificationId(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      notificationSocketService.disconnect();
    };
  }, [currentRecipientKey, role, token]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      role,
      canReceiveNotifications,
    }),
    [notifications, unreadCount, role, canReceiveNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
