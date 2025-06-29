import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader, Upload, Image, Check, X, FileText, Shield } from "lucide-react";
import { getAccessToken } from "@/utils/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const TutorIDUpload = () => {
  const accessToken = getAccessToken();
  const [nidFile, setNidFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Only JPG and PNG are supported.");
      return false;
    }

    return true;
  };

  const handleFileSelection = (file) => {
    if (!validateFile(file)) return;

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setNidFile(file);
    setUploadComplete(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUpload = async () => {
    if (!nidFile) {
      toast.error("Please select a file first.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("student_document", nidFile);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/upload-document/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadProgress(100);
      setUploadComplete(true);
      toast.success("ID document uploaded successfully!");
      window.location.reload();
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload ID document.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setNidFile(null);
    setPreviewUrl(null);
    setUploadComplete(false);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-2">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Identity
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Upload a clear photo of your Student ID card for secure verification. 
            Your information is encrypted and protected.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {!previewUrl ? (
              /* Upload Zone */
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer group ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onClick={triggerFileInput}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
                    dragActive ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}>
                    <Upload className={`w-8 h-8 transition-colors ${
                      dragActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {dragActive ? 'Drop your file here' : 'Choose file or drag & drop'}
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG or PNG format, up to 5MB
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    className="mt-4 border-2 hover:bg-blue-50 hover:border-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerFileInput();
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              </div>
            ) : (
              /* Preview Section */
              <div className="space-y-6">
                <div className="relative">
                  <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="NID Preview"
                      className="w-full h-64 object-contain"
                    />
                    <button
                      onClick={removeFile}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <Image className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-xs">
                          {nidFile?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {nidFile && formatFileSize(nidFile.size)}
                        </p>
                      </div>
                    </div>
                    {uploadComplete && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || uploadComplete}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : uploadComplete ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Uploaded
                      </>
                    ) : (
                      "Upload & Continue"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border-t border-blue-100 p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Your data is secure</p>
                <p className="text-blue-700">
                  All uploads are encrypted and processed securely. Your personal information 
                  is protected according to our privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default TutorIDUpload;