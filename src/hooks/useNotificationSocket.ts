import {useEffect, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read?: boolean;
  [key: string]: any;
}

export function useNotificationSocket(url: string, options?: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, options);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', () => {
      setConnected(false);
    });
    socket.on('notification', (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  // Optionally expose send/read/clear helpers
  const sendNotification = (notif: Notification) => {
    socketRef.current?.emit('notification', notif);
  };
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? {...n, read: true} : n))
    );
  };
  const clearNotifications = () => setNotifications([]);

  return {
    notifications,
    connected,
    sendNotification,
    markAsRead,
    clearNotifications,
    socket: socketRef.current
  };
}
