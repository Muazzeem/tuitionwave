
import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyState: React.FC = (showTips = false) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Welcome to Messages
        </h3>
        <p className="text-gray-500 mb-4">
          Select a conversation from the sidebar to start messaging with your tutors and students.
        </p>
        <div className="text-sm text-gray-400 none">
          💡 Tip: Click on any conversation to view your message history
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
