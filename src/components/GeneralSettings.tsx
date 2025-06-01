import { useUserProfile, ProfileData } from '@/contexts/UserProfileContext';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { Camera, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GeneralSettings = () => {
  const { profile, updateProfile, loading, refreshProfile } = useUserProfile();
  const { userProfile, fetchProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  const [formData, setFormData] = useState<Partial<ProfileData>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    user_type: '',
    profile_picture: null,
    is_nid_verified: false
  });

  useEffect(() => {
    refreshProfile();
  }, [location.pathname]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        user_type: profile.user_type || '',
        profile_picture: profile.profile_picture || null,
        is_nid_verified: profile.is_nid_verified || false
      });

      if (profile.profile_picture && typeof profile.profile_picture === 'string') {
        setPreviewUrl(profile.profile_picture);
      }
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, profile_picture: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const submitData = new FormData();

      submitData.append('first_name', formData.first_name || '');
      submitData.append('last_name', formData.last_name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');
      submitData.append('user_type', formData.user_type || '');

      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      } else if (formData.profile_picture === null) {
        submitData.append('profile_picture', ''); // ✅ force remove
      }

      // DEBUG
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await updateProfile(submitData);

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-gray-600">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>{previewUrl ? 'Change Picture' : 'Upload Picture'}</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-sm text-gray-500 text-center">
            Supported formats: JPG, PNG, GIF<br />
            Maximum size: 5MB
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="dark:text-white">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
