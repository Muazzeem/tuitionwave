import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Friend } from '@/types/friends';
import FriendsService from '@/services/FriendsService';
import { getAccessToken } from '@/utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './ChatHeader';
import MessagesContainer from './MessagesContainer';
import MessageInput from './MessageInput';
import FriendsList from './FriendsList';


interface MessagingInterfaceProps {
  onClose?: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string | null;
  id: string;
}

interface Message {
  id: number;
  text: string;
  attachment?: {
    url: string;
    name: string;
    size: number;
    type: string;
  } | string | null;
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
  const { userId } = useParams(); // Get userId from URL params
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

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

  const markAllUnreadAsRead = () => {
    const unreadMessages = messages.filter(
      message => !message.is_read && message.sender_email !== userProfile?.email
    );
    const unreadIds = unreadMessages.map(message => message.id);
    if (unreadIds.length > 0) {
      markMessagesAsRead(unreadIds);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const updateFriendLastMessage = (friendId: number, messageText: string, timestamp: string) => {
    setFriends(prev => 
      prev.map(friend => 
        friend.friend.id === friendId 
          ? {
              ...friend,
              last_message: {
                text: messageText,
                sender_id: userProfile?.id || 0,
                is_from_me: true,
                sent_at: timestamp
              },
              last_message_time: timestamp
            }
          : friend
      )
    );
  };

  const updateFriendLastMessageFromReceived = (senderId: number, messageText: string, timestamp: string) => {
    fetchFriends();
    setFriends(prev => 
      prev.map(friend => 
        friend.friend.id === senderId 
          ? {
              ...friend,
              last_message: {
                text: messageText,
                sender_id: senderId,
                is_from_me: false,
                sent_at: timestamp
              },
              last_message_time: timestamp,
              unread_messages_count: friend.unread_messages_count + 1
            }
          : friend
      )
    );
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Handle URL parameter changes
  useEffect(() => {
    if (userId && friends.length > 0) {
      const friend = friends.find(f => f.friend.id.toString() === userId);
      if (friend && friend !== selectedFriend) {
        setSelectedFriend(friend);
      } else if (!friend && userId) {
        // If friend not found in the list, clear selection and show error
        console.error('Friend not found with ID:', userId);
        setSelectedFriend(null);
        toast({
          title: "User not found",
          description: "The user you're trying to message could not be found.",
          variant: "destructive"
        });
      }
    } else if (!userId) {
      setSelectedFriend(null);
    }
  }, [userId, friends, selectedFriend]);

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

  useEffect(() => {
    if (messages.length > 0 && selectedFriend) {
      const timer = setTimeout(() => {
        markAllUnreadAsRead();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages.length, selectedFriend]);

  useEffect(() => {
    if (messages.length > 0) {
      logUnreadMessageIds(messages, 'Messages state updated');
    }
  }, [messages]);

  const connectWebSocket = () => {
    if (socket) {
      socket.close();
    }

    const wsUrl = `ws://api.tuitionwave.com/ws/chat/?token=${accessToken}`;
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
          attachment: data.attachment || null,
          sent_at: data.sent_at || new Date().toISOString(),
          sender_name: data.sender_name || '',
          sender_email: data.sender_email || '',
          receiver_name: data.receiver_name || '',
          receiver_email: data.receiver_email || userProfile?.email || '',
          is_read: false
        };

        if (data.sender_email !== userProfile?.email) {
          console.log('New incoming message (unread):', newMsg.id);
          logUnreadMessageIds([newMsg], 'New WebSocket message');
          setMessages(prev => {
            const updatedMessages = [...prev, newMsg];
            setTimeout(() => logUnreadMessageIds(updatedMessages, 'After WebSocket message added'), 0);
            return updatedMessages;
          });
          
          // Update friend's last message for received message
          const senderId = data.sender_id || data.sender_email;
          if (senderId) {
            setTimeout(() => {
              updateFriendLastMessageFromReceived(senderId, data.message, newMsg.sent_at);
            }, 1000);
          }
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
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedFriend || !socket) return;

    const timestamp = new Date().toISOString();

    try {
      if (newMessage.trim()) {
        const messageData = {
          type: 'chat_message',
          message: newMessage.trim(),
          receiver_id: selectedFriend.friend.id
        };

        const tempMessage: Message = {
          id: Date.now(),
          text: newMessage,
          sent_at: timestamp,
          sender_name: (userProfile?.first_name || '') + ' ' + (userProfile?.last_name || '') || userProfile?.email || '',
          sender_email: userProfile?.email || '',
          receiver_name: selectedFriend.friend.full_name,
          receiver_email: selectedFriend.friend.email,
          is_read: false
        };

        setMessages(prev => [...prev, tempMessage]);
        socket.send(JSON.stringify(messageData));
        
        // Update friend's last message for sent message
        setTimeout(() => {
          updateFriendLastMessage(selectedFriend.friend.id, newMessage, timestamp);
        }, 1000);
      }

      if (selectedFiles.length > 0) {
        for (const fileWithPreview of selectedFiles) {
          try {
            const base64Data = await fileToBase64(fileWithPreview.file);
            
            const fileMessageData = {
              type: 'file_message',
              receiver_id: selectedFriend.friend.id,
              message: newMessage.trim() || `Sent ${fileWithPreview.file.name}`,
              file_data: base64Data,
              file_name: fileWithPreview.file.name,
              file_type: fileWithPreview.file.type,
              file_size: fileWithPreview.file.size
            };

            const fileMessage = `Sent ${fileWithPreview.file.name}`;
            const tempFileMessage: Message = {
              id: Date.now() + Math.random(),
              text: fileMessage,
              attachment: fileWithPreview.preview || fileWithPreview.file.name,
              sent_at: timestamp,
              sender_name: (userProfile?.first_name || '') + ' ' + (userProfile?.last_name || '') || userProfile?.email || '',
              sender_email: userProfile?.email || '',
              receiver_name: selectedFriend.friend.full_name,
              receiver_email: selectedFriend.friend.email,
              is_read: false
            };

            setMessages(prev => [...prev, tempFileMessage]);
            socket.send(JSON.stringify(fileMessageData));
            
            // Update friend's last message for sent file
            setTimeout(() => {
              updateFriendLastMessage(selectedFriend.friend.id, fileMessage, timestamp);
            }, 1000);

            if (fileWithPreview.preview) {
              URL.revokeObjectURL(fileWithPreview.preview);
            }
          } catch (error) {
            console.error('Error sending file:', error);
            toast({
              title: "Error",
              description: `Failed to send ${fileWithPreview.file.name}`,
              variant: "destructive"
            });
          }
        }
      }

      setNewMessage('');
      setSelectedFiles([]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (files: FileWithPreview[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriend(friend);
    navigate(`/message/${friend.friend.id}`);
  };

  const handleBackToList = () => {
    setSelectedFriend(null);
    navigate('/message');
  };

  return (
    <div className="h-screen bg-white flex dark:bg-gray-800">
      <div className={`${selectedFriend ? 'hidden md:flex' : 'flex'}`}>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFriendSelect={handleFriendSelect}
          isLoading={isLoading}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedFriend && (
          <>
            <ChatHeader
              friend={selectedFriend}
              onBack={handleBackToList}
              showBackButton={true}
            />
            
            <MessagesContainer
              messages={messages}
              userEmail={userProfile?.email || ''}
              isLoading={false}
            />
            
            <MessageInput
              message={newMessage}
              selectedFiles={selectedFiles}
              onMessageChange={setNewMessage}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onSendMessage={sendMessage}
              disabled={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
