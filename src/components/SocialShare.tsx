
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';


interface SocialShareProps {
  tutorUid: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  tutorUid,
}) => {
  const { toast } = useToast();

  const profileUrl = `${window.location.origin}/tutor/${tutorUid}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      window.open(profileUrl, '_blank');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors hover:text-white"
      onClick={handleCopyLink}
    >
      <Share2 className="w-4 h-4" />
      Share Profile
    </Button>
  );
};

export default SocialShare;
