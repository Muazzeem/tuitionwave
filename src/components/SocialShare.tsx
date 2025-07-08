
import React, { useState } from 'react';
import { Share2, Facebook, Linkedin, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SocialShareProps {
  tutorName: string;
  tutorUniversity: string;
  tutorLocation: string;
  tutorRate: number;
  tutorType: string;
  tutorUid: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  tutorName,
  tutorUniversity,
  tutorLocation,
  tutorRate,
  tutorType,
  tutorUid,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/tutor/${tutorUid}`;
  const shareTitle = `Check out ${tutorName} - ${tutorUniversity} Tutor`;
  const shareDescription = `${tutorName} is a ${tutorType.toLowerCase()} tutor from ${tutorUniversity} in ${tutorLocation}. Monthly rate: ৳${tutorRate.toLocaleString()}`;

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}&quote=${encodeURIComponent(shareDescription)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Profile link has been copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Share your profile</h4>
          
          <div className="space-y-2">
            <Button
              onClick={handleFacebookShare}
              variant="outline"
              className="w-full justify-start gap-2 text-blue-600 hover:bg-blue-50"
            >
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </Button>
            
            <Button
              onClick={handleLinkedInShare}
              variant="outline"
              className="w-full justify-start gap-2 text-blue-700 hover:bg-blue-50"
            >
              <Linkedin className="w-4 h-4" />
              Share on LinkedIn
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
            <p className="font-medium">{shareTitle}</p>
            <p className="mt-1">{shareDescription}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SocialShare;
