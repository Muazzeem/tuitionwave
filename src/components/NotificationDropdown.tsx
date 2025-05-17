import React, { useState, useEffect } from 'react';
import { Bell, X, Check, MessageSquare, Calendar, FileText } from 'lucide-react';
import { getAccessToken } from "@/utils/auth";
import { useToast } from '@/hooks/use-toast';

interface NotificationProps {
    onMarkAllRead: () => void;
}

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
    target: ActionObject | null;
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

const NotificationDropdown: React.FC<NotificationProps> = ({ onMarkAllRead }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const accessToken = getAccessToken();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: NotificationsResponse = await response.json();
                setNotifications(data.results);
                setUnreadCount(data.results.filter(notif => notif.unread).length);
            } catch (e: any) {
                setError('Failed to load notifications');
                console.error("Error fetching notifications:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [accessToken]); // Re-fetch if the access token changes

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/mark-read/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, unread: false } : notif
                ));
                setUnreadCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
                toast({
                    title: "Success",
                    description: "Notification marked as read.",
                });
            } else {
                console.error(`Failed to mark notification ${id} as read`);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/mark-all-read/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
                setUnreadCount(0);
                onMarkAllRead();
            } else {
                console.error('Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const removeNotification = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const deletedNotification = notifications.find(notif => notif.id === id);
                setNotifications(notifications.filter(notif => notif.id !== id));
                if (deletedNotification?.unread) {
                    setUnreadCount(prevCount => prevCount - 1);
                }
            } else {
                console.error(`Failed to delete notification ${id}`);
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const getNotificationIcon = (level: string) => {
        switch (level) {
            case 'success':
                return <Check className="h-5 w-5 text-green-500" />;
            case 'info':
                return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'warning':
                return <Calendar className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <X className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} mins ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="relative">
            <button
                className="text-gray-500 hover:text-gray-700 relative p-2"
                onClick={toggleDropdown}
                disabled={loading}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200">
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                                disabled={loading}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto dark:bg-gray-800">
                        {loading ? (
                            <div className="px-4 py-6 text-center text-gray-500">
                                <p>Loading notifications...</p>
                            </div>
                        ) : error ? (
                            <div className="px-4 py-6 text-center text-red-500">
                                <p>{error}</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            {getNotificationIcon(notification.level)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium">{notification.verb} {notification.action_object?.__str__ || notification.target?.__str__ || ''}</p>
                                                <div className="flex items-center">
                                                    {notification.unread && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-500 hover:text-blue-700 mr-1"
                                                            title="Mark as read"
                                                            disabled={loading}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeNotification(notification.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Remove notification"
                                                        disabled={loading}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(notification.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                                <p>No new notifications</p>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <a href="/notifications" className="block text-xs text-center text-blue-600 hover:text-blue-800">
                            View all notifications
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
