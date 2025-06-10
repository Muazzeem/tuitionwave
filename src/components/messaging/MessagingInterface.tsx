import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Friend } from '@/types/friends';
import FriendsService from '@/services/FriendsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { getAccessToken } from '@/utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import LinkPreview from './LinkPreview';
import { detectUrls } from '@/utils/linkUtils';

interface MessagingInterfaceProps {
  onClose?: () => void;
}

interface Message {
  id: number;
  text: string;
  sent_at: string;
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  is_read: boolean;
}

interface MessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    messages: Message[];
    friend_info: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      full_name: string;
    };
  };
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ onClose }) => {
  const accessToken = getAccessToken();
  const navigate = useNavigate();
  const { friendId } = useParams();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuth();

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Helper function to log unread message IDs
  const logUnreadMessageIds = (messagesList: Message[], context: string = '') => {
    const unreadMessages = messagesList.filter(message => !message.is_read);
    const unreadIds = unreadMessages.map(message => message.id);

    if (unreadIds.length > 0) {
      console.log(`${context} - Unread message IDs:`, unreadIds);
      console.log(`${context} - Unread messages details:`, unreadMessages);
    } else {
      console.log(`${context} - No unread messages found`);
    }
  };

  const updateFriendUnreadCount = (friendId: number, countReduction: number) => {
    setFriends(prev => 
      prev.map(friend => 
        friend.friend.id === friendId 
          ? {
              ...friend,
              unread_messages_count: Math.max(0, friend.unread_messages_count - countReduction)
            }
          : friend
      )
    );
  };

  // Mark messages as read API call
  const markMessagesAsRead = async (messageIds: number[]) => {
    if (messageIds.length === 0) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/mark-read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message_ids: messageIds
        })
      });

      if (response.ok) {
        setMessages(prev => prev.map(message =>
          messageIds.includes(message.id)
            ? { ...message, is_read: true }
            : message
        ));
        logUnreadMessageIds(messages.filter(m => !messageIds.includes(m.id) || m.is_read), 'After marking as read');
        if (selectedFriend) {
          updateFriendUnreadCount(selectedFriend.friend.id, messageIds.length);
        }
      } else {
        console.error('Failed to mark messages as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Mark all unread messages in current conversation as read
  const markAllUnreadAsRead = () => {
    const unreadMessages = messages.filter(message =>
      !message.is_read && message.sender_email !== userProfile?.email
    );
    const unreadIds = unreadMessages.map(message => message.id);

    if (unreadIds.length > 0) {
      markMessagesAsRead(unreadIds);
    }
  };

  useEffect(() => {
    fetchFriends();
    const urlParams = new URLSearchParams(window.location.search);
    const friendId = urlParams.get('friend');
    console.log('friendId:', friendId);
  }, []);

  useEffect(() => {
    if (friendId && friends.length > 0) {
      const friend = friends.find(f => f.friend.id.toString() === friendId);
      if (friend) {
        setSelectedFriend(friend);
      }
    }
  }, [friendId, friends]);

  useEffect(() => {
    if (selectedFriend?.friend.id) {
      fetchMessages(selectedFriend.friend.id);
      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedFriend]);

  // Scroll to bottom when messages are loaded for a new friend
  useEffect(() => {
    if (messages.length > 0 && selectedFriend) {
      // Wait for messages to render, then scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length, selectedFriend?.friend.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Only auto-scroll if user is near the bottom (within 200px)
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        
        if (isNearBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 50);
        }
      }
    }
  }, [messages]);

  // Log unread messages whenever messages state changes
  useEffect(() => {
    if (messages.length > 0) {
      logUnreadMessageIds(messages, 'Messages state updated');
    }
  }, [messages]);

  const connectWebSocket = () => {
    if (socket) {
      socket.close();
    }

    const wsUrl = `ws://127.0.0.1:9000/ws/chat/?token=${accessToken}`;

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);

      if (data.type === 'chat_message') {
        const newMsg: Message = {
          id: data.id || Date.now(),
          text: data.message,
          sent_at: data.sent_at || new Date().toISOString(),
          sender_name: data.sender_name || '',
          sender_email: data.sender_email || '',
          receiver_name: data.receiver_name || '',
          receiver_email: data.receiver_email || userProfile?.email || '',
          is_read: false
        };

        // Only add if it's not from the current user (to avoid duplicates)
        if (data.sender_email !== userProfile?.email) {
          console.log('New incoming message (unread):', newMsg.id);
          logUnreadMessageIds([newMsg], 'New WebSocket message');
          setMessages(prev => {
            const updatedMessages = [...prev, newMsg];
            // Log after state update
            setTimeout(() => logUnreadMessageIds(updatedMessages, 'After WebSocket message added'), 0);
            return updatedMessages;
          });
        }
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);
  };

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await FriendsService.getFriends();
      setFriends(response.accepted_friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (friendId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/conversations/${friendId}/messages/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: MessageResponse = await response.json();
        console.log('Fetched messages from API:', data.results.messages.length);
        logUnreadMessageIds(data.results.messages, 'Fetched from API');
        setMessages(data.results.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !socket) return;

    const messageData = {
      type: 'chat_message',
      message: newMessage.trim(),
      receiver_id: selectedFriend.friend.id
    };

    // Add message optimistically first
    const tempMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sent_at: new Date().toISOString(),
      sender_name: (userProfile?.first_name || '') + ' ' + (userProfile?.last_name || '') || userProfile?.email || '',
      sender_email: userProfile?.email || '',
      receiver_name: selectedFriend.friend.full_name,
      receiver_email: selectedFriend.friend.email,
      is_read: false // Your own messages start as unread until confirmed
    };

    console.log('Sending message (initially unread):', tempMessage.id);
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    // Then send via WebSocket
    socket.send(JSON.stringify(messageData));
  };

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriend(friend);
    navigate(`/message/?friend=${friend.friend.id}`);
    // Reset pagination state when selecting new friend
    setMessages([]);
  };

  const handleBackToList = () => {
    setSelectedFriend(null);
    navigate('/message');
  };

  const filteredFriends = friends.filter(friend =>
    friend.friend.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return format(date, 'MMM d');
  };

  return (
    <div className="h-screen bg-white flex dark:bg-gray-900">
      {/* Sidebar - Hide on mobile when friend is selected */}
      <div className={`w-80 bg-gray-50 border-r flex flex-col ${selectedFriend ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Message</h1>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">Explore all the tuition request from guardian</p>

          <div className="relative">
            <Input
              placeholder="Search name, chat, etc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto dark:bg-gray-900">
          {filteredFriends.map((friend) => {
            const isActive = selectedFriend?.friend.uid === friend.friend.uid;
            const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
            const lastMessageText = friend.last_message?.text || 'Start a conversation';
            const lastMessageTime = friend.last_message_time ? formatTime(friend.last_message_time) : '';

            return (
              <div
                key={friend.friend.uid}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${isActive ? 'bg-blue-50 border-r-2 border-blue-500 dark:bg-gray-800' : ''
                  }`}
                onClick={() => handleFriendSelect(friend)}
              >
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate text-sm dark:text-white">
                      {displayName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {lastMessageTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate">
                      {lastMessageText}
                    </p>
                    {friend.unread_messages_count > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                        {friend.unread_messages_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between dark:bg-gray-900">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mr-3 md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt={selectedFriend.friend.full_name} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {selectedFriend.friend.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedFriend.friend.full_name}
                  </h2>
                  <p className="text-sm text-gray-500">last seen recently</p>
                </div>
              </div>
            </div>

            {/* Messages Area with Infinite Scroll */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50 pl-5 pr-10 dark:bg-gray-900"
            >
              {/* Loading indicator for more messages */}
              {isLoadingMore && (
                <div className="text-center mb-4">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                    Loading more messages...
                  </span>
                </div>
              )}

              {messages.length > 0 && (
                <div className="text-center mb-4">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                    {formatMessageTime(messages[0]?.sent_at)}
                  </span>
                </div>
              )}

              {messages.map((message) => {
                const isOwnMessage = message.sender_email === userProfile?.email;
                const urls = detectUrls(message.text);

                return (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="" alt={message.sender_name} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {message.sender_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'ml-auto' : ''}`}>
                      <div className={`px-3 sm:px-4 py-2 rounded-2xl ${isOwnMessage
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 shadow-sm border rounded-bl-md'
                        }`}>
                        <p className="text-sm leading-relaxed break-words">{message.text}</p>
                      </div>

                      {/* Link Previews */}
                      {urls.length > 0 && (
                        <div className="mt-2">
                          {urls.map((url, index) => (
                            <LinkPreview 
                              key={index} 
                              url={url} 
                              className={isOwnMessage ? 'bg-blue-50' : 'bg-white'}
                            />
                          ))}
                        </div>
                      )}

                      <div className={`text-xs mt-1 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        <span className="text-gray-500">{formatTime(message.sent_at)}</span>
                        {isOwnMessage && (
                          <span className="ml-1 text-blue-500">
                            {message.is_read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t dark:bg-gray-900">
              <div className="flex items-end space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[40px] max-h-32 resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="sm"
                >
                  <Send className="h-4 w-4 dark:text-white" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a friend to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
