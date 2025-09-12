import React, { useRef } from 'react';
import { Camera, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ProfilePictureSectionProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemoveImage: () => void;
}

export const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  previewUrl,
  onFileSelect,
  onRemoveImage
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select a valid image file.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative group">
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-20 h-20 text-muted-foreground" />
            )}
          </div>
        </div>
        {previewUrl && (
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={triggerFileInput}
        className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground border-primary px-6 py-2 rounded-lg transition-colors"
      >
        <Camera className="w-4 h-4" />
        <span>{previewUrl ? 'Change Picture' : 'Upload Picture'}</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-sm text-muted-foreground text-center">
        Supported formats: JPG, PNG, GIF • Maximum size: 5MB
      </p>
    </div>
  );
};