import React, { useState, useEffect } from 'react';
import { Bell, X, Check, MessageSquare, Calendar, FileText, ChevronLeft, ChevronRight, Filter, ArrowLeft } from 'lucide-react';
import { getAccessToken } from "@/utils/auth";
import { useToast } from '@/hooks/use-toast';
import NotificationDetailModal from "@/components/NotificationDetailModal";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    const { userProfile, clearProfile } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterUnread, setFilterUnread] = useState<boolean | null>(null);
    const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const accessToken = getAccessToken();

    const userType = userProfile?.user_type?.toLowerCase() === 'teacher' ? 'teacher' : 'guardian';

    useEffect(() => {
        fetchNotifications();
    }, [currentPage, filterType, filterUnread]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct URL with query parameters
            let url = `http://127.0.0.1:8000/api/notifications?page=${currentPage}`;
            if (filterType) {
                url += `&level=${filterType}`;
            }
            if (filterUnread !== null) {
                url += `&unread=${filterUnread}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: NotificationsResponse = await response.json();
            setNotifications(data.results);
            setTotalPages(data.total_pages);
            setTotalCount(data.count);
        } catch (e: any) {
            setError('Failed to load notifications');
            console.error("Error fetching notifications:", e);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notifications/mark-read/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            if (response.ok) {
                setNotifications(notifications.map(notif =>
                    notif.id === id ? { ...notif, unread: false } : notif
                ));
                toast({
                    title: "Success",
                    description: "Notification marked as read.",
                });
            } else {
                console.error(`Failed to mark notification ${id} as read`);
                toast({
                    title: "Error",
                    description: "Failed to mark notification as read.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast({
                title: "Error",
                description: "An error occurred while marking the notification as read.",
                variant: "destructive",
            });
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/notifications/mark-all-read/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            if (response.ok) {
                setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
                toast({
                    title: "Success",
                    description: "All notifications marked as read.",
                });
            } else {
                console.error('Failed to mark all notifications as read');
                toast({
                    title: "Error",
                    description: "Failed to mark all notifications as read.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast({
                title: "Error",
                description: "An error occurred while marking all notifications as read.",
                variant: "destructive",
            });
        }
    };

    const removeNotification = async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notifications/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            
            if (response.ok) {
                setNotifications(notifications.filter(notif => notif.id !== id));
                toast({
                    title: "Success",
                    description: "Notification deleted successfully.",
                });
            } else {
                console.error(`Failed to delete notification ${id}`);
                toast({
                    title: "Error",
                    description: "Failed to delete notification.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the notification.",
                variant: "destructive",
            });
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
        return date.toLocaleString();
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFilterChange = (type: string | null) => {
        setFilterType(type === filterType ? null : type);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleUnreadFilterChange = (unread: boolean | null) => {
        setFilterUnread(unread === filterUnread ? null : unread);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const openNotificationModal = (notification: NotificationItem) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const closeNotificationModal = () => {
        setIsModalOpen(false);
    };

    const backHome = () => {
        navigate(`/${userType}/dashboard`);
    }

    return (
        <div className="container mx-auto py-5 px-4">
            <div className="mb-3">
                <Button
                    onClick={backHome}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 bg-gray-100 hover:bg-gray-300 mt-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Notifications</h1>
                
                <div className="flex flex-wrap gap-2">
                    <div className="dropdown relative">
                        <button className="px-3 py-2 bg-white border border-gray-300 rounded-md flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter by Type
                        </button>
                        <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden">
                            <div className="py-1">
                                <button
                                    onClick={() => handleFilterChange(null)}
                                    className={`block px-4 py-2 text-sm w-full text-left ${!filterType ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    All Types
                                </button>
                                <button
                                    onClick={() => handleFilterChange('success')}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterType === 'success' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Success
                                </button>
                                <button
                                    onClick={() => handleFilterChange('info')}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterType === 'info' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Info
                                </button>
                                <button
                                    onClick={() => handleFilterChange('warning')}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterType === 'warning' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Warning
                                </button>
                                <button
                                    onClick={() => handleFilterChange('error')}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterType === 'error' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Error
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="dropdown relative">
                        <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden">
                            <div className="py-1">
                                <button
                                    onClick={() => handleUnreadFilterChange(null)}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterUnread === null ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    All Notifications
                                </button>
                                <button
                                    onClick={() => handleUnreadFilterChange(true)}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterUnread === true ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Unread Only
                                </button>
                                <button
                                    onClick={() => handleUnreadFilterChange(false)}
                                    className={`block px-4 py-2 text-sm w-full text-left ${filterUnread === false ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    Read Only
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={markAllAsRead}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        Mark All Read
                    </button>
                </div>
            </div>
            
            {/* Filter badges */}
            {(filterType || filterUnread !== null) && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filterType && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            <button 
                                onClick={() => handleFilterChange(null)} 
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {filterUnread !== null && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            Status: {filterUnread ? 'Unread' : 'Read'}
                            <button 
                                onClick={() => handleUnreadFilterChange(null)} 
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    
                    <button 
                        onClick={() => {
                            setFilterType(null);
                            setFilterUnread(null);
                            setCurrentPage(1);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">
                        <p>{error}</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div>
                        <table className="min-w-full divide-y divide-gray-200">
                        <ScrollArea type="always" style={{ height: 'calc(90vh - 160px)' }}>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notification
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notifications.map((notification) => (
                                    <tr 
                                        key={notification.id} 
                                        className={`hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mr-3">
                                                    {getNotificationIcon(notification.level)}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => openNotificationModal(notification)}
                                                        className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left"
                                                    >
                                                        {notification.verb} {notification.action_object?.__str__ || ''}
                                                    </button>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${notification.level === 'success' ? 'bg-green-100 text-green-800' : 
                                                notification.level === 'info' ? 'bg-blue-100 text-blue-800' : 
                                                notification.level === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                                                notification.level === 'error' ? 'bg-red-100 text-red-800' : 
                                                'bg-gray-100 text-gray-800'}`}
                                            >
                                                {notification.level.charAt(0).toUpperCase() + notification.level.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(notification.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${notification.unread ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                {notification.unread ? 'Unread' : 'Read'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                {notification.unread && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => removeNotification(notification.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </ScrollArea>
                        </table>
                        
                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === 1 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                        currentPage === totalPages 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * 10, totalCount)}
                                        </span>{' '}
                                        of <span className="font-medium">{totalCount}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                                currentPage === 1 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        
                                        {/* Page numbers */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            
                                            // Logic to show a window of pages around current page
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        currentPage === pageNumber
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                                currentPage === totalPages 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <div className="inline-flex justify-center rounded-full p-4 bg-gray-100 mb-4">
                            <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                        <p className="mt-1 text-gray-500">You don't have any notifications at the moment.</p>
                    </div>
                )}
            </div>

            {/* Notification Detail Modal */}
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