import React from 'react';
import { X, Check, MessageSquare, Calendar, Bell } from 'lucide-react';
import { getAccessToken } from "@/utils/auth";
import { useToast } from '@/hooks/use-toast';

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

interface NotificationDetailModalProps {
    notification: NotificationItem | null;
    isOpen: boolean;
    onClose: () => void;
    onMarkAsRead: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
    notification,
    isOpen,
    onClose,
    onMarkAsRead,
    onDelete
}) => {
    const { toast } = useToast();

    if (!isOpen || !notification) {
        return null;
    }

    const getNotificationIcon = (level: string) => {
        switch (level) {
            case 'success':
                return <Check className="h-8 w-8 text-green-500" />;
            case 'info':
                return <MessageSquare className="h-8 w-8 text-blue-500" />;
            case 'warning':
                return <Calendar className="h-8 w-8 text-yellow-500" />;
            case 'error':
                return <X className="h-8 w-8 text-red-500" />;
            default:
                return <Bell className="h-8 w-8 text-gray-500" />;
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            weekday: 'long',  // Full name of the day (e.g., "Wednesday")
            year: 'numeric',
            month: 'long',    // Full name of the month (e.g., "April")
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true      // Use AM/PM format; set to false for 24-hour
        });
    };

    const handleMarkAsRead = async () => {
        if (notification.unread) {
            await onMarkAsRead(notification.id);
        }
    };

    const handleDelete = async () => {
        await onDelete(notification.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="mr-3">
                            {getNotificationIcon(notification.level)}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Notification Details
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Modal content */}
                <div className="px-6 py-5">
                    <div className="space-y-5">
                        <div>
                            <h3 className="font-medium text-gray-500 mb-1">Status</h3>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full
                                ${notification.unread ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                                {notification.unread ? 'Unread' : 'Read'}
                            </span>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-gray-500 mb-1">Timestamp</h3>
                            <p className="text-gray-800">{formatDate(notification.timestamp)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-gray-500 mb-1">Subject</h3>
                            <p className="text-gray-800 font-medium">{notification.verb} {notification.action_object?.__str__ || ''}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-gray-500 mb-1">Description</h3>
                            <p className="text-gray-800">{notification.description}</p>
                        </div>
                        
                        {notification.actor && (
                            <div>
                                <h3 className="font-medium text-gray-500 mb-1">Actor</h3>
                                <p className="text-gray-800">{notification.actor.__str__}</p>
                            </div>
                        )}
                        
                        {notification.action_object && (
                            <div>
                                <h3 className="font-medium text-gray-500 mb-1">Action Object</h3>
                                <p className="text-gray-800">{notification.action_object.__str__}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {notification.action_object.model} ({notification.action_object.app_label})
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Modal footer */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 gap-3">
                    {notification.unread && (
                        <button
                            onClick={handleMarkAsRead}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Read
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium flex items-center"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailModal;