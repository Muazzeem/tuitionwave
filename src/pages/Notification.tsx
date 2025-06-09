import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bell, X, Check, MessageSquare, Calendar, FileText,
  Filter, ArrowLeft, Loader2
} from 'lucide-react';
import { getAccessToken } from "@/utils/auth";
import { useToast } from '@/hooks/use-toast';
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Actor {
  id: number;
  model: string;
  app_label: string;
  __str__: string;
}

interface ActionObject {
  id: number;
  model: string;
  app_label: string;
  __str__: string;
}

interface NotificationItem {
  id: number;
  slug: number;
  level: string;
  actor_content_type: number;
  actor_object_id: string;
  actor: Actor;
  verb: string;
  description: string;
  target_content_type: number | null;
  target_object_id: string | null;
  target: null;
  action_object_content_type: number | null;
  action_object_object_id: string | null;
  action_object: ActionObject | null;
  timestamp: string;
  unread: boolean;
  deleted: boolean;
  emailed: boolean;
}

interface NotificationsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterUnread, setFilterUnread] = useState<boolean | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const accessToken = getAccessToken();

  const userType = userProfile?.user_type?.toLowerCase() === 'teacher' ? 'teacher' : 'guardian';

  useEffect(() => {
    setNotifications([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchNotifications(1, true);
  }, [filterType, filterUnread]);

  const fetchNotifications = async (page: number = 1, reset: boolean = false) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      let url = `${import.meta.env.VITE_API_URL}/api/notifications?page=${page}`;
      if (filterType) url += `&level=${filterType}`;
      if (filterUnread !== null) url += `&unread=${filterUnread}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: NotificationsResponse = await response.json();

      setNotifications(prev =>
        reset || page === 1 ? data.results : [...prev, ...data.results]
      );
      setTotalCount(data.count);
      setHasMore(data.next !== null);
      setCurrentPage(page);
    } catch (e) {
      console.error("Error fetching notifications:", e);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchNotifications(currentPage + 1);
  }, [currentPage, loadingMore, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, loadingMore]);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-read/${id}/`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => notif.id === id ? { ...notif, unread: false } : notif)
        );
        toast({ title: "Success", description: "Notification marked as read." });
      } else throw new Error();
    } catch {
      toast({ title: "Error", description: "Failed to mark as read.", variant: "destructive" });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        toast({ title: "Success", description: "All notifications marked as read." });
      } else throw new Error();
    } catch {
      toast({ title: "Error", description: "Failed to mark all as read.", variant: "destructive" });
    }
  };

  const removeNotification = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setTotalCount(prev => prev - 1);
        toast({ title: "Success", description: "Notification deleted." });
      } else throw new Error();
    } catch {
      toast({ title: "Error", description: "Failed to delete notification.", variant: "destructive" });
    }
  };

  const openNotificationModal = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeNotificationModal = () => setIsModalOpen(false);
  const backHome = () => navigate(`/${userType}/dashboard`);

  const getNotificationIcon = (level: string) => {
    switch (level) {
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'info': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'warning': return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleString();

  return (
    <div className="container mx-auto py-5 px-4">
      <div className="mb-3">
        <Button onClick={backHome} className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : notifications.length > 0 ? (
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map(notification => (
                  <tr key={notification.id} className={notification.unread ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-start">
                        <div className="mr-2">{getNotificationIcon(notification.level)}</div>
                        <div>
                          <button onClick={() => openNotificationModal(notification)} className="font-medium text-gray-800 hover:text-blue-600">
                            {notification.verb} {notification.action_object?.__str__}
                          </button>
                          <p className="text-xs text-gray-500">{notification.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        notification.level === 'success' ? 'bg-green-100 text-green-800' :
                        notification.level === 'info' ? 'bg-blue-100 text-blue-800' :
                        notification.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        notification.level === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(notification.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        notification.unread ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.unread ? 'Unread' : 'Read'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex space-x-3 justify-end">
                        {notification.unread && (
                          <button onClick={() => markAsRead(notification.id)} title="Mark as read">
                            <Check className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                          </button>
                        )}
                        <button onClick={() => removeNotification(notification.id)} title="Delete">
                          <X className="h-4 w-4 text-red-600 hover:text-red-800" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Infinite scroll loader outside table */}
            <div ref={loadMoreRef} className="py-6 text-center">
              {loadingMore ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading more...</span>
                </div>
              ) : hasMore ? (
                <span className="text-sm text-gray-500">Scroll down to load more</span>
              ) : (
                <span className="text-sm text-gray-500">End of notifications • {notifications.length} of {totalCount}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p>You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={closeNotificationModal}
        onMarkAsRead={markAsRead}
        onDelete={removeNotification}
      />
    </div>
  );
};

export default NotificationsPage;
