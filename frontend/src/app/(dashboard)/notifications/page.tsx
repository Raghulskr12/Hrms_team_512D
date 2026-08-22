'use client';

import React, { useState, useEffect } from 'react';
import { notificationService } from '../../../services/notificationService';
import { Notification } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const list = await notificationService.getAll();
      setNotifications(list || []);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    await notificationService.markRead(id);
    fetchNotifs();
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    fetchNotifs();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Info className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <span>Notifications Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Updates regarding your leave requests, attendance, and HR announcements.</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkRead(notif.id)}
              className={`p-4 rounded-xl border transition-all flex items-start space-x-4 cursor-pointer ${
                !notif.isRead
                  ? 'bg-slate-900 border-purple-900/60 shadow-xs'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-75'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-100">{notif.title}</h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" title="Unread" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="You have no unread or historical notifications." />
      )}
    </div>
  );
}
