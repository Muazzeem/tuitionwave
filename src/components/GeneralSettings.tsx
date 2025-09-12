import { useUserProfile, ProfileData } from '@/contexts/UserProfileContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationPreferencesForm } from '@/components/LocationPreferences/LocationPreferencesForm';
import { ProfilePictureSection } from '@/components/ProfilePicture/ProfilePictureSection';

const GeneralSettings = () => {
  const { profile, updateProfile, loading, refreshProfile } = useUserProfile();
  const { fetchProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<ProfileData & {
    division_id: number | null;
    preferred_district_id: number | null;
    preferred_upazila_id: number | null;
    preferred_area_id: number | null;
  }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    profile_picture: null,
    is_nid_verified: false,
    division_id: null,
    preferred_district_id: null,
    preferred_upazila_id: null,
    preferred_area_id: null
  });

  // Initialize initial state from profile data
  const [initialLocationNames, setInitialLocationNames] = useState({
    division: '',
    district: '',
    upazila: '',
    area: ''
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
        is_nid_verified: profile.is_nid_verified || false,
        division_id: profile.division?.id || null,
        preferred_district_id: profile.preferred_districts?.[0]?.id || null,
        preferred_upazila_id: profile.preferred_upazila?.[0]?.id || null,
        preferred_area_id: profile.preferred_area?.id || null
      });

      if (profile.profile_picture && typeof profile.profile_picture === 'string') {
        setPreviewUrl(profile.profile_picture);
      }

      // Set initial location names for the location form
      setInitialLocationNames({
        division: profile.division?.name || '',
        district: profile.preferred_districts?.[0]?.name || '',
        upazila: profile.preferred_upazila?.[0]?.name || '',
        area: profile.preferred_area?.name || ''
      });
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

  const handleLocationChange = (updates: Partial<{
    division_id: number | null;
    preferred_district_id: number | null;
    preferred_upazila_id: number | null;
    preferred_area_id: number | null;
    address: string;
  }>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

      // Add location fields
      if (formData.division_id) {
        submitData.append('division', formData.division_id.toString());
      }

      if (formData.preferred_district_id) {
        submitData.append('preferred_districts', formData.preferred_district_id.toString());
      }

      if (formData.preferred_upazila_id) {
        submitData.append('preferred_upazila', formData.preferred_upazila_id.toString());
      }

      if (formData.preferred_area_id) {
        submitData.append('preferred_area', formData.preferred_area_id.toString());
      }

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
          <h2 className="text-3xl font-bold mb-8 text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            General Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <ProfilePictureSection
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onRemoveImage={handleRemoveImage}
            />

            {/* Basic Information */}
            <div className="bg-card/20 rounded-xl p-6 border border-border/30">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first_name" className="text-foreground">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    className="mt-1 border-border bg-background/50 text-foreground focus:border-ring transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-foreground">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    className="mt-1 border-border bg-background/50 text-foreground focus:border-ring transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 border-border bg-muted/50 text-muted-foreground"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder='+880123456789'
                    className="mt-1 border-border bg-background/50 text-foreground focus:border-ring transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Location Preferences */}
            <LocationPreferencesForm
              formData={{
                division_id: formData.division_id,
                preferred_district_id: formData.preferred_district_id,
                preferred_upazila_id: formData.preferred_upazila_id,
                preferred_area_id: formData.preferred_area_id,
                address: formData.address || ''
              }}
              onFormDataChange={handleLocationChange}
              initialDivisionName={initialLocationNames.division}
              initialDistrictName={initialLocationNames.district}
              initialUpazilaName={initialLocationNames.upazila}
              initialAreaName={initialLocationNames.area}
            />

            {/* Submit Section */}
            <div className="flex justify-end pt-6 border-t border-border/30">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 flex items-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;