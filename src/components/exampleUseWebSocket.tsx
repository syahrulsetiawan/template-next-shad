import React from 'react';
import {useNotificationSocket} from '@/hooks/useNotificationSocket';

export default function ExampleUseWebSocket() {
  const {
    notifications,
    connected,
    sendNotification,
    markAsRead,
    clearNotifications
  } = useNotificationSocket('http://localhost:3000', {
    transports: ['websocket']
    // auth: { token: "your-token" },
  });

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <div className="mb-2 font-semibold">
        WebSocket Status:{' '}
        <span className={connected ? 'text-green-600' : 'text-red-600'}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <button
        className="mb-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={clearNotifications}
      >
        Clear All Notifications
      </button>
      <ul className="space-y-2">
        {notifications.length === 0 && (
          <li className="text-muted-foreground">No notifications yet.</li>
        )}
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-2 rounded border ${notif.read ? 'bg-gray-100' : 'bg-yellow-50'}`}
          >
            <div className="font-bold">{notif.title}</div>
            <div>{notif.message}</div>
            <div className="flex gap-2 mt-2">
              {!notif.read && (
                <button
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                  onClick={() => markAsRead(notif.id)}
                >
                  Mark as read
                </button>
              )}
              <button
                className="px-2 py-1 text-xs bg-indigo-500 text-white rounded"
                onClick={() =>
                  sendNotification({
                    id: Date.now().toString(),
                    title: 'Manual Notification',
                    message: 'This is a test notification.'
                  })
                }
              >
                Send Test Notification
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
