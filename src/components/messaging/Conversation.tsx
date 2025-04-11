
import React, { useState, useRef, useEffect } from "react";
import { Chat, Message, MessageType } from "@/types/message";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { 
  Image, 
  Paperclip, 
  Send, 
  Mic, 
  MoreVertical, 
  X, 
  Play, 
  Pause, 
  Trash, 
  MicOff 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! How can I help you today?",
    senderId: "user2",
    receiverId: "user1",
    timestamp: new Date(Date.now() - 600000),
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    content: "I have a question about my tuition.",
    senderId: "user1",
    receiverId: "user2",
    timestamp: new Date(Date.now() - 540000),
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    content: "/placeholder.svg",
    senderId: "user2",
    receiverId: "user1",
    timestamp: new Date(Date.now() - 480000),
    type: "image",
    isRead: true,
    fileName: "schedule.jpg",
    fileSize: 245000,
  },
  {
    id: "4",
    content: "Here's a document with all the details.",
    senderId: "user2",
    receiverId: "user1",
    timestamp: new Date(Date.now() - 420000),
    type: "file",
    isRead: true,
    fileName: "tuition_details.pdf",
    fileSize: 1240000,
    fileUrl: "#",
  },
  {
    id: "5",
    content: "/audio-placeholder.mp3",
    senderId: "user1",
    receiverId: "user2",
    timestamp: new Date(Date.now() - 360000),
    type: "audio",
    isRead: true,
    audioDuration: 15,
  },
];

interface ConversationProps {
  chat: Chat;
  onDeleteChat: () => void;
}

const Conversation: React.FC<ConversationProps> = ({ chat, onDeleteChat }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: uuidv4(),
        content: inputMessage,
        senderId: "user1", // Current user ID
        receiverId: chat.participants.find((id) => id !== "user1") || "",
        timestamp: new Date(),
        type: "text",
        isRead: false,
      };

      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file to storage and get a URL
      const fakeUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: uuidv4(),
        content: fakeUrl,
        senderId: "user1",
        receiverId: chat.participants.find((id) => id !== "user1") || "",
        timestamp: new Date(),
        type: "file",
        isRead: false,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: fakeUrl,
      };

      setMessages([...messages, newMessage]);
      toast.success("File uploaded successfully");
      
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // In a real app, you'd upload the image to storage and get a URL
      const fakeUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: uuidv4(),
        content: fakeUrl,
        senderId: "user1",
        receiverId: chat.participants.find((id) => id !== "user1") || "",
        timestamp: new Date(),
        type: "image",
        isRead: false,
        fileName: file.name,
        fileSize: file.size,
      };

      setMessages([...messages, newMessage]);
      toast.success("Image uploaded successfully");
      
      // Reset file input
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const toggleRecording = () => {
    // In a real app, you'd use Web Audio API or MediaRecorder
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulate ending recording and creating a message
      const fakeDuration = recordingTime;
      
      const newMessage: Message = {
        id: uuidv4(),
        content: "/audio-placeholder.mp3", // Fake audio file
        senderId: "user1",
        receiverId: chat.participants.find((id) => id !== "user1") || "",
        timestamp: new Date(),
        type: "audio",
        isRead: false,
        audioDuration: fakeDuration,
      };

      setMessages([...messages, newMessage]);
      toast.success("Voice message recorded");
    } else {
      // Simulate starting recording
      toast.info("Recording voice message...");
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
    setSelectedMessage(null);
    toast.success("Message deleted");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatAudioDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleAudioPlayback = (messageId: string) => {
    // In a real app, you'd control audio playback here
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>
              {chat.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{chat.name}</h3>
            <p className="text-xs text-gray-500">
              {chat.participants.includes("user1") ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer"
              onClick={onDeleteChat}
            >
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages area */}
      <ScrollArea 
        className="flex-1 p-4" 
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === "user1";
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] relative group`}>
                  {/* Message content based on type */}
                  {message.type === "text" && (
                    <div
                      className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}

                  {message.type === "image" && (
                    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={message.content}
                            alt="Uploaded image"
                            className="max-w-full cursor-pointer object-cover"
                            style={{ maxHeight: "200px" }}
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0">
                          <img
                            src={message.content}
                            alt="Uploaded image"
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                      <div className="p-2 text-xs text-gray-500">
                        {message.fileName} • {formatFileSize(message.fileSize || 0)}
                      </div>
                    </div>
                  )}

                  {message.type === "file" && (
                    <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                      <a
                        href={message.fileUrl}
                        download={message.fileName}
                        className="flex items-center"
                      >
                        <div className="bg-blue-100 rounded p-2 mr-3">
                          <Paperclip className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-blue-500 truncate">
                            {message.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(message.fileSize || 0)}
                          </p>
                        </div>
                      </a>
                    </div>
                  )}

                  {message.type === "audio" && (
                    <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mr-2"
                          onClick={() => toggleAudioPlayback(message.id)}
                        >
                          {playingAudio === message.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: playingAudio === message.id ? "100%" : "0%",
                              transition: "width 1s linear",
                            }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {formatAudioDuration(message.audioDuration || 0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp and message actions */}
                  <div
                    className={`text-xs mt-1 flex items-center ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-gray-500">
                      {format(message.timestamp, "h:mm a")}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          Delete Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Recording indicator */}
          {isRecording && (
            <div className="flex justify-center my-2">
              <div className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs flex items-center">
                <span className="animate-pulse h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                Recording voice message... {formatAudioDuration(recordingTime)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-2 text-red-500"
                  onClick={toggleRecording}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image className="h-5 w-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={imageInputRef}
                onChange={handleImageUpload}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </Button>
            
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              className={`${isRecording ? "" : "text-gray-500 hover:text-gray-700"}`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
          
          <Input
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
            disabled={isRecording}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="ml-3 text-blue-500"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isRecording}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
