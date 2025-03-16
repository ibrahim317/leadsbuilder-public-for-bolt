import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationsBadgeProps {
  className?: string;
}

export default function NotificationsBadge({ className = '' }: NotificationsBadgeProps) {
  const { unreadCount, loading } = useNotifications();

  return (
    <Link
      to="/admin/notifications"
      className={`relative inline-flex items-center p-2 rounded-full hover:bg-gray-100 ${className}`}
      aria-label="Notifications"
    >
      <Bell className="h-6 w-6 text-gray-500" />
      {!loading && unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
