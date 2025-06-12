
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import LinkPreview from './LinkPreview';
import { detectUrls } from '@/utils/linkUtils';
import { Download, FileText, Image, Video, Paperclip, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  text: string;
  attachment?: string | null;
  sent_at: string;
  sender_name: string;
  sender_email: string;
  receiver_name: string;
  receiver_email: string;
  is_read: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  showAvatar = true 
}) => {
  const urls = detectUrls(message.text);
  const hasAttachment = message.attachment && typeof message.attachment === 'string';

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const cleanName = fileName.replace(/^[a-f0-9-]+\./, '');
    return cleanName || 'Attachment';
  };

  const isImage = (url: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(getFileExtension(url));
  };

  const isVideo = (url: string) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
    return videoExtensions.includes(getFileExtension(url));
  };

  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const handleDownload = (url: string) => {
    const fullUrl = getFullUrl(url);
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = getFileName(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAttachment = () => {
    if (!hasAttachment) return null;

    const attachment = message.attachment as string;
    const fileName = getFileName(attachment);
    const fullUrl = getFullUrl(attachment);

    if (isImage(attachment)) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
          <img 
            src={fullUrl} 
            alt="Shared image" 
            className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => window.open(fullUrl, '_blank')}
          />
        </div>
      );
    }

    if (isVideo(attachment)) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
          <video 
            controls 
            className="w-full h-auto max-h-64 rounded-lg"
            preload="metadata"
          >
            <source src={fullUrl} type={`video/${getFileExtension(attachment)}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // File attachment
    return (
      <div className="mt-2">
        <div 
          className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-opacity-80 transition-colors max-w-xs ${
            isOwnMessage 
              ? 'bg-blue-400 text-white border-blue-300' 
              : 'bg-white text-gray-700 border-gray-200 shadow-sm'
          }`}
          onClick={() => window.open(fullUrl, '_blank')}
        >
          <div className="mr-3">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {fileName}
            </div>
            <div className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
              Click to open
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 ml-2" 
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(attachment);
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8 mr-3 mt-1">
          <AvatarImage src="" alt={message.sender_name} />
          <AvatarFallback className="bg-gray-400 text-white text-xs">
            {message.sender_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isOwnMessage ? 'ml-auto' : ''}`}>
        {/* Text Message */}
        {message.text && (
          <div className={`px-4 py-2 rounded-2xl shadow-sm ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-900 border rounded-bl-md'
          }`}>
            <p className="text-sm leading-relaxed break-words">{message.text}</p>
          </div>
        )}

        {/* Attachment */}
        {renderAttachment()}

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

        {/* Message Info */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500">
            {formatTime(message.sent_at)}
          </span>
          {isOwnMessage && (
            <span className="text-xs text-blue-500">
              {message.is_read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
