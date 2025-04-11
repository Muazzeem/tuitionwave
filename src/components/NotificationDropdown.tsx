import React, { useState } from 'react';
import { Bell, X, Check, MessageSquare, Calendar, FileText } from 'lucide-react';

interface NotificationProps {
    onMarkAllRead: () => void;
}

interface Notification {
    id: number;
    type: 'message' | 'appointment' | 'system';
    title: string;
    description: string;
    time: string;
    read: boolean;
}

const NotificationDropdown: React.FC<NotificationProps> = ({ onMarkAllRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'message',
            title: 'New Message',
            description: 'John Smith sent you a message about your recent appointment',
            time: '10 mins ago',
            read: false
        },
        {
            id: 2,
            type: 'appointment',
            title: 'Appointment Reminder',
            description: 'Your meeting with Team Alpha is scheduled for tomorrow at 10:00 AM',
            time: '2 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'system',
            title: 'Document Updated',
            description: 'The "Q1 Report" document has been updated with new information',
            time: '1 day ago',
            read: true
        }
    ]);

    const unreadCount = notifications.filter(notif => !notif.read).length;

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        onMarkAllRead();
    };

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'appointment':
                return <Calendar className="h-5 w-5 text-green-500" />;
            case 'system':
                return <FileText className="h-5 w-5 text-purple-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                className="text-gray-500 hover:text-gray-700 relative p-2"
                onClick={toggleDropdown}
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
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium">{notification.title}</p>
                                                <div className="flex items-center">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-500 hover:text-blue-700 mr-1"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeNotification(notification.id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Remove notification"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-gray-500">
                                <p>No notifications</p>
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