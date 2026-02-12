'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  icon: string;
  message: string;
  marketId?: string;
  userId?: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const res = await fetch('/api/users/me/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      setMarkingRead(true);
      const res = await fetch('/api/users/me/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      });

      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    } finally {
      setMarkingRead(false);
    }
  }

  function handleNotificationClick(notification: Notification) {
    // Mark as read (optimistic update)
    if (!notification.read) {
      setNotifications(notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Send to server (fire and forget)
      fetch('/api/users/me/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', notificationId: notification.id })
      });
    }

    // Navigate to relevant page
    if (notification.marketId) {
      router.push(`/markets/${notification.marketId}`);
    } else if (notification.userId) {
      router.push(`/users/${notification.userId}`);
    }
  }

  function getTimeAgo(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neutral-800 rounded" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-neutral-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingRead}
              className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg hover:border-orange-500 transition-colors disabled:opacity-50"
            >
              {markingRead ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold mb-2">No notifications yet</h2>
            <p className="text-neutral-400 mb-6">
              You'll see updates about your markets and positions here
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Explore Markets
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left p-4 rounded-lg transition-all hover:bg-neutral-900 ${
                  notification.read
                    ? 'bg-black border border-neutral-800'
                    : 'bg-neutral-900 border border-orange-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0 mt-1">
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`mb-1 ${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-neutral-400">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Load More (placeholder for future) */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
              Load older notifications
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
