import { useNotification, useSSE } from '@/Neuron/hooks';
import type { INotification as INotificationItem } from '@/Neuron/types';
import { Bell, CheckCircle2, ClipboardCheck, Info, Loader2, Play, ShieldAlert, X, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  CONFIRM_GUIDELINE: { icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
  AUTOMATION_COMPLETED: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  AUTOMATION_ERROR: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  RUN_ERROR: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
  AUTOMATION_STARTED: { icon: Play, color: 'text-amber-500', bg: 'bg-amber-50' },
};

const DEFAULT_TYPE_CONFIG = { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50' };

interface INotificationProps {
  collapsed: boolean;
}

export const Notification: React.FC<INotificationProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { isNotificationFetching, notificationList, fetchNotification, pushNotification, markNotificationAsRead } =
    useNotification();

  const notifications: INotificationItem[] = notificationList ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    fetchNotification();
  }, []);

  useSSE({
    onAutomationNotification: ({ id, message, notification_type, automation_id }) => {
      pushNotification({ id, message, notification_type, automation_id });
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (!prev) fetchNotification();
      return !prev;
    });
  };

  const onMarkComplete = (status: string, automationId: string, notificationType: string) => {
    setMarkingNotificationId(null);
    if (status === 'success' && notificationType === 'CONFIRM_GUIDELINE') {
      setIsOpen(false);
      navigate(`/workflow/${automationId}/review`);
    }
    if (status === 'success' && notificationType === 'RUN_ERROR') {
      setIsOpen(false);
      navigate(`/workflow/list`, { state: { tab: 'RUN_ERROR' } });
    }
  };

  const handleNotificationClick = (notification: INotificationItem) => {
    if (markingNotificationId) return;
    console.log('[Notification] Clicked:', notification);
    setMarkingNotificationId(notification.id);
    const mapToRequest = {
      id: notification.id,
    };
    markNotificationAsRead(mapToRequest, (status: string) => {
      onMarkComplete(status, notification.automation_id, notification.notification_type);
    });
  };

  return (
    <div
      ref={panelRef}
      className='relative'
    >
      <button
        onClick={handleToggle}
        className={`relative flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${collapsed ? 'justify-center px-0' : ''}`}
      >
        <div className='relative shrink-0'>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className='absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full'>
              {unreadCount}
            </span>
          )}
        </div>
        {!collapsed && <span>Notifications</span>}
      </button>

      {isOpen && (
        <div className='absolute bottom-0 left-full ml-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
            <h3 className='text-sm font-semibold text-gray-800'>Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className='p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            >
              <X size={14} />
            </button>
          </div>

          <div className='max-h-72 overflow-y-auto'>
            {isNotificationFetching && notifications.length === 0 && (
              <p className='px-4 py-6 text-xs text-gray-400 text-center'>Loading...</p>
            )}
            {!isNotificationFetching && notifications.length === 0 && (
              <p className='px-4 py-6 text-xs text-gray-400 text-center'>No notifications</p>
            )}
            {notifications.map((notification) => {
              const config = NOTIFICATION_TYPE_CONFIG[notification.notification_type] ?? DEFAULT_TYPE_CONFIG;
              const Icon = config.icon;
              const isMarking = markingNotificationId === notification.id;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  disabled={isMarking}
                  className={`flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 border-b border-gray-50 last:border-b-0 ${!notification.is_read ? 'bg-blue-50/30' : ''} ${isMarking ? 'opacity-60 cursor-wait' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg ${config.bg} shrink-0 mt-0.5`}>
                    {isMarking ? (
                      <Loader2
                        size={14}
                        className='text-gray-400 animate-spin'
                      />
                    ) : (
                      <Icon
                        size={14}
                        className={config.color}
                      />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='text-xs font-semibold text-gray-800 truncate'>
                        {notification.notification_type?.replace(/_/g, ' ') ?? 'NOTIFICATION'}
                      </p>
                      {!notification.is_read && <span className='w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0' />}
                    </div>
                    <p className='text-[11px] text-gray-500 mt-0.5 line-clamp-2'>{notification.message}</p>
                    {notification.created_at && (
                      <p className='text-[10px] text-gray-400 mt-1'>
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
