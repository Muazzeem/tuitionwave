
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Friend } from '@/types/friends';
import FriendsService from '@/services/FriendsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

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
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend?.friend.id) {
      fetchMessages(selectedFriend.friend.id);
    }
  }, [selectedFriend]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await FriendsService.getFriends();
      // Add missing properties to make friends compatible
      const friendsWithIds = response.accepted_friends.map((friend, index) => ({
        ...friend,
        id: friend.friend.id,
        conversation_id: friend.friend.id // Using friend id as conversation id
      }));
      setFriends(friendsWithIds);
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
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data: MessageResponse = await response.json();
        setMessages(data.results.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      // For now, we'll add the message optimistically
      const tempMessage: Message = {
        id: Date.now(),
        text: newMessage,
        sent_at: new Date().toISOString(),
        sender_name: userProfile?.full_name || '',
        sender_email: userProfile?.email || '',
        receiver_name: selectedFriend.friend.full_name,
        receiver_email: selectedFriend.friend.email,
        is_read: false
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

      // TODO: Implement WebSocket sending
      console.log('Sending message via WebSocket:', {
        type: 'chat_message',
        message: newMessage,
        receiver_id: selectedFriend.friend.id
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        <div className="p-4">
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
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.map((friend) => {
            const isActive = selectedFriend?.friend.id === friend.friend.id;
            const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
            const lastMessageText = friend.last_message?.text || 'Start a conversation';
            const lastMessageTime = friend.last_message_time ? formatTime(friend.last_message_time) : '';
            
            return (
              <div
                key={friend.friend.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
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
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt={selectedFriend.friend.full_name} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {selectedFriend.friend.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedFriend.friend.full_name}
                  </h2>
                  <p className="text-sm text-gray-500">last seen recently</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length > 0 && (
                <div className="text-center mb-4">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                    {formatMessageTime(messages[0]?.sent_at)}
                  </span>
                </div>
              )}
              
              {messages.map((message) => {
                const isOwnMessage = message.sender_email === userProfile?.email;
                
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
                    
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <div className={`text-xs mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        <span className="text-gray-500">
                          {formatTime(message.sent_at)}
                        </span>
                        {isOwnMessage && (
                          <span className="ml-1 text-blue-500">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
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
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
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
