
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader, Upload, Image } from "lucide-react";

interface NIDUploadProps {
  onComplete: (nidFile: File) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const NIDUpload: React.FC<NIDUploadProps> = ({ onComplete }) => {
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Only JPG and PNG are supported.");
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setNidFile(file);

    // Clean up the object URL when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleUpload = async () => {
    if (!nidFile) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    try {
      await onComplete(nidFile);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload NID document.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <div className="mx-auto w-32 h-32 mb-6">
        <img
          src="/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png"
          alt="ID Verification"
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2">Upload NID Document</h2>
      <p className="text-gray-500 mb-6">
        Please upload your National ID Document for verification
      </p>

      {previewUrl ? (
        <div className="mb-6">
          <div className="relative w-full h-48 border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="NID Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={triggerFileInput}
          >
            <Image className="mr-2" size={16} />
            Change Image
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6"
          onClick={triggerFileInput}
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            JPG or PNG (max. 5MB)
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png"
        className="hidden"
      />

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
        onClick={handleUpload}
        disabled={!nidFile || uploading}
      >
        {uploading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload & Continue"
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => window.history.back()}
        disabled={uploading}
      >
        Back
      </Button>
    </div>
  );
};

export default NIDUpload;
