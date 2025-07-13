
import React from 'react';
import { MessageCircle, Sparkles, Users, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 py-8">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <MessageCircle className="h-10 w-10 text-primary" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-5 w-5 text-primary/60 animate-pulse" />
            </div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Welcome to Messages
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Select a conversation from the sidebar to start messaging with your tutors and students.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Users className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Connect with tutors and students instantly</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Share files, images, and messages seamlessly</span>
          </div>
        </div>
        
        <div className="mt-6 md:hidden">
          <Button 
            variant="outline" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to conversations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
