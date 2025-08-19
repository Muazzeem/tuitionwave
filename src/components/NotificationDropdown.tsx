import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, X, Check, MessageSquare, Calendar, FileText, Loader } from 'lucide-react';
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
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const accessToken = getAccessToken();

    const enforceHttps = (url: string) => {
        if (url.startsWith("http://")) {
            return url.replace("http://", "https://");
        }
        return url;
    };

    const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const url = page === 1
                ? `${import.meta.env.VITE_API_URL}/api/notifications`
                : nextUrl || `${import.meta.env.VITE_API_URL}/api/notifications?page=${page}`;

            const backEndUrl = enforceHttps(url);
            const response = await fetch(backEndUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: NotificationsResponse = await response.json();

            if (append) {
                setNotifications(prev => [...prev, ...data.results]);
            } else {
                setNotifications(data.results);
                setUnreadCount(data.results.filter(notif => notif.unread).length);
            }

            setHasMore(!!data.next);
            setNextUrl(data.next);
            setCurrentPage(data.current_page);
        } catch (e: any) {
            setError('Failed to load notifications');
            console.error("Error fetching notifications:", e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [accessToken, nextUrl]);

    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        // Load more when scrolled to 80% of the content
        if (scrollPercentage > 0.8 && hasMore && !loadingMore && !loading) {
            fetchNotifications(currentPage + 1, true);
        }
    }, [hasMore, loadingMore, loading, currentPage, fetchNotifications]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen && notifications.length === 0) {
            fetchNotifications();
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-read/${id}/`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read/`, {
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

    const getNotificationIcon = (level: string) => {
        switch (level) {
            case 'success':
                return <Check className="h-5 w-5 text-green-400" />;
            case 'info':
                return <MessageSquare className="h-5 w-5 text-blue-400" />;
            case 'warning':
                return <Calendar className="h-5 w-5 text-yellow-400" />;
            case 'error':
                return <X className="h-5 w-5 text-red-400" />;
            default:
                return <Bell className="h-5 w-5 text-gray-400" />;
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
                className="text-gray-300 hover:text-white relative p-2 transition-colors duration-200"
                onClick={toggleDropdown}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-700 bg-gray-900">
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                disabled={loading}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div
                        ref={scrollRef}
                        className="max-h-80 overflow-y-auto bg-gray-900 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        onScroll={handleScroll}
                    >
                        {loading && notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-400">
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    <p>Loading notifications...</p>
                                </div>
                            </div>
                        ) : error ? (
                                <div className="px-4 py-6 text-center text-red-400">
                                <p>{error}</p>
                            </div>
                        ) : notifications.length > 0 ? (
                                    <>
                                        {notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                onClick={notification.unread ? () => markAsRead(notification.id) : undefined}
                                                className={`px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200 ${notification.unread
                                                    ? 'bg-gray-800/50 cursor-pointer border-l-4 border-l-blue-500'
                                                    : 'bg-gray-900'
                                                    }`}
                                            >
                                                <div className="flex">
                                                    <div className="flex-shrink-0 mr-3">
                                                        {getNotificationIcon(notification.level)}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-medium text-white">
                                                                {notification.verb} {notification.action_object?.__str__ || notification.target?.__str__ || ''}
                                                            </p>
                                                            {notification.unread && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatDate(notification.timestamp)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {loadingMore && (
                                            <div className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center space-x-2 text-gray-400">
                                                    <Loader className="h-4 w-4 animate-spin" />
                                                    <span className="text-xs">Loading more...</span>
                                                </div>
                                            </div>
                                        )}

                                        {!hasMore && notifications.length > 0 && (
                                            <div className="px-4 py-3 text-center text-gray-500">
                                                <p className="text-xs">No more notifications</p>
                                            </div>
                                        )}
                                    </>
                        ) : (
                                        <div className="px-4 py-6 text-center text-gray-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <Bell className="h-8 w-8 text-gray-600" />
                                                <p>No notifications yet</p>
                                            </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;