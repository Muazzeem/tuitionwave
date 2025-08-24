
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  attachment?: string | {
    url: string;
    name: string;
    size: number;
    type: string;
  };
  isOwn?: boolean;
  avatar?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  isOnline: boolean;
  lastMessage?: string;
  unreadCount?: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  sender: string;
}

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
}
