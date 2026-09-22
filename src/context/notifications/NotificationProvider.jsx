import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import notificationSocketService from "../../services/notificationService";
import NotificationContext from "./NotificationContext";

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) {
      notificationSocketService.disconnect();
      return;
    }

    notificationSocketService.connect(token, (newNotification) => {
      const notification = {
        id: Date.now() + Math.random(),
        read: false,
        ...newNotification,
      };

      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      notificationSocketService.disconnect();
    };
  }, [token]);

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
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
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
    }),
    [notifications, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
