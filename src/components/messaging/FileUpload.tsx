
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileText, Image, Video, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileWithPreview {
  file: File;
  preview: string | null;
  id: string;
}

interface FileUploadProps {
  onFileSelect: (files: FileWithPreview[]) => void;
  selectedFiles: FileWithPreview[];
  onRemoveFile: (id: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFiles, onRemoveFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check file size limit (10MB per file)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Each file must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    const filesWithPreview: FileWithPreview[] = files.map(file => {
      const id = Date.now() + Math.random().toString();
      let preview: string | null = null;

      // Create preview for images
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      return { file, preview, id };
    });

    onFileSelect(filesWithPreview);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
      />
      

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedFiles.map((fileWithPreview) => (
            <div
              key={fileWithPreview.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
            >
              {fileWithPreview.preview ? (
                <img
                  src={fileWithPreview.preview}
                  alt={fileWithPreview.file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                  {getFileIcon(fileWithPreview.file.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileWithPreview.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileWithPreview.file.size)}
                </p>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(fileWithPreview.id)}
                className="p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        className="p-2"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FileUpload;
