import { useUserProfile, ProfileData } from '@/contexts/UserProfileContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePictureSection } from '@/components/ProfilePicture/ProfilePictureSection';

const GeneralSettings = () => {
  const { profile, updateProfile, refreshProfile } = useUserProfile();
  const { fetchProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<ProfileData & {
  }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: null,
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
        profile_picture: profile.profile_picture || null,
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

  const handleFileSelect = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, profile_picture: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.phone) {
        toast({
          title: 'Validation Error',
          description: 'Phone number is required.',
          variant: 'destructive',
        });
        return;
      }

      setIsSaving(true);

      const submitData = new FormData();

      submitData.append('first_name', formData.first_name || '');
      submitData.append('last_name', formData.last_name || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');

      if (selectedFile) {
        submitData.append('profile_picture', selectedFile);
      } else if (formData.profile_picture === null) {
        submitData.append('profile_picture', '');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Picture Section */}
      <ProfilePictureSection
        previewUrl={previewUrl}
        onFileSelect={handleFileSelect}
        onRemoveImage={handleRemoveImage}
      />

      {/* Basic Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="first_name" className="text-white">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <Label htmlFor="last_name" className="text-white">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder='+880123456789'
            className="mt-1 text-white bg-slate-800/50 border-slate-600 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Submit Section */}
      <div className="flex justify-end pt-6 border-t border-border/30">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-600 text-primary-foreground px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettings;