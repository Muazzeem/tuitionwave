
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Friend } from '@/types/friends';
import { Files, Image, Video, FileText, Download, ChevronRight } from 'lucide-react';

interface FilesSidebarProps {
  friends: Friend[];
  isVisible: boolean;
  onToggle: () => void;
}

const FilesSidebar: React.FC<FilesSidebarProps> = ({
  friends,
  isVisible,
  onToggle
}) => {
  // Mock data for file sharing statistics
  const getFileStats = (friendId: number) => {
    // This would normally come from your API
    const mockStats = {
      total: Math.floor(Math.random() * 50) + 5,
      images: Math.floor(Math.random() * 20) + 2,
      videos: Math.floor(Math.random() * 10) + 1,
      documents: Math.floor(Math.random() * 15) + 2
    };
    return mockStats;
  };

  const totalSharedFiles = friends.reduce((total, friend) => {
    return total + getFileStats(friend.friend.id).total;
  }, 0);

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-background border shadow-md hover:shadow-lg transition-all duration-200 ${
          isVisible ? 'translate-x-0' : 'translate-x-0'
        }`}
      >
        <Files className="h-4 w-4" />
        <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
          {totalSharedFiles}
        </Badge>
      </Button>

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-background border-l shadow-lg transition-transform duration-300 z-40 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      } w-80`}>
        <Card className="h-full border-0 rounded-none flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Files className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Shared Files</h2>
                  <p className="text-xs text-muted-foreground">{totalSharedFiles} total files</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="p-2 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Files Statistics */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Files className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No files shared</p>
                <p className="text-muted-foreground text-sm">
                  Start conversations to share files
                </p>
              </div>
            ) : (
              friends.map((friend) => {
                const stats = getFileStats(friend.friend.id);
                const displayName = friend.friend.full_name || friend.friend.email.split('@')[0];
                
                return (
                  <Card key={friend.friend.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src="" alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate mb-2">
                          {displayName}
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Image className="h-4 w-4" />
                              <span>Images</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {stats.images}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Video className="h-4 w-4" />
                              <span>Videos</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {stats.videos}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>Documents</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {stats.documents}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm pt-2 border-t">
                            <span className="font-medium text-foreground">Total</span>
                            <Badge className="bg-primary text-primary-foreground">
                              {stats.total}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          View All Files
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Overlay */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilesSidebar;
