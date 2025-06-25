
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile, Mic } from 'lucide-react';
import FileUpload from './FileUpload';

interface FileWithPreview {
  file: File;
  preview: string | null;
  id: string;
}

interface MessageInputProps {
  message: string;
  selectedFiles: FileWithPreview[];
  onMessageChange: (message: string) => void;
  onFileSelect: (files: FileWithPreview[]) => void;
  onRemoveFile: (id: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  selectedFiles,
  onMessageChange,
  onFileSelect,
  onRemoveFile,
  onSendMessage,
  disabled = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t dark:bg-gray-900">
      {/* File Upload */}
      <FileUpload 
        onFileSelect={onFileSelect}
        selectedFiles={selectedFiles}
        onRemoveFile={onRemoveFile}
      />
      
      {/* Message Input */}
      <div className="flex items-end gap-3 mt-0 lg:mt-3 mb-20 lg:mb-0 md:mb-0">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none pr-20 rounded-full border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />          
        </div>
        
        <Button
          onClick={onSendMessage}
          disabled={disabled || (!message.trim() && selectedFiles.length === 0)}
          className="bg-blue-500 hover:bg-blue-600 rounded-full h-11 w-11 p-0 dark:bg-blue-400 dark:hover:bg-blue-300"
        >
          <Send className="h-4 w-4 dark:text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
