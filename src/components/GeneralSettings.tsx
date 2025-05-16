import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Loader2 } from "lucide-react";
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useToast } from "@/components/ui/use-toast";
import { getAccessToken } from '@/utils/auth';
import { ProfileData } from '@/types/common';


const GeneralSettings = () => {
    const { toast } = useToast();
    const accessToken = getAccessToken();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country_code: 'gb',
        country: 'uk',
        city: 'london',
        user_type: '',
    });
    const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    // Handle file input change for profile picture
    useEffect(() => {
        if (newProfilePicture) {
            const objectUrl = URL.createObjectURL(newProfilePicture);
            setPreviewUrl(objectUrl);
            
            // Clean up the URL when component unmounts or when file changes
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [newProfilePicture]);

    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            if (!accessToken) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }

            const data = await response.json();
            setProfileData(data);
            
            // Set profile picture preview if available
            if (data.profile_picture) {
                setPreviewUrl(data.profile_picture);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast({
                title: "Error",
                description: "Failed to load profile data. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewProfilePicture(e.target.files[0]);
        }
    };

    const handleDeletePicture = async () => {
        setPreviewUrl(null);
        setNewProfilePicture(null);
        
        // If we're removing an existing profile picture on the server
        if (profileData.profile_picture) {
            setProfileData(prev => ({
                ...prev,
                profile_picture: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            if (!accessToken) {
                throw new Error('Authentication token not found');
            }

            let response;
            
            // Check if we're dealing with a profile picture update
            if (newProfilePicture || profileData.profile_picture === undefined) {
                // Use FormData for file uploads
                const formData = new FormData();
                
                // Add all profile fields to FormData
                Object.entries(profileData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formData.append(key, value.toString());
                    }
                });
                
                // Add new profile picture if selected
                if (newProfilePicture) {
                    formData.append('profile_picture', newProfilePicture);
                } else if (profileData.profile_picture === undefined) {
                    // If profile picture was deleted, send an explicit null value
                    formData.append('profile_picture', '');
                }

                response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        // Don't set Content-Type header - browser will set it with boundary parameter
                    },
                    body: formData
                });
            } else {
                // Use JSON for regular data updates (no file involved)
                // Filter out profile_picture to avoid sending it as string
                const { profile_picture, ...dataToSend } = profileData;
                
                response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to update profile');
            }

            const updatedData = await response.json();
            setProfileData(updatedData);
            
            toast({
                title: "Success",
                description: "Profile updated successfully",
                variant: "default"
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Generate initials for avatar fallback
    const getInitials = () => {
        return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 dark:bg-gray-900">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General</h2>
                <p className="text-gray-500 mt-1 dark:text-white">Manage general settings for your account</p>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <ScrollArea type="always" style={{ height: 'calc(83vh - 160px)' }}>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1 dark:text-gray-300">Profile Picture</h3>
                        <p className="text-sm text-gray-500 mb-4 dark:text-gray-300">Upload a profile image.</p>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                {previewUrl ? (
                                    <AvatarImage src={previewUrl} alt="Profile" />
                                ) : (
                                    <AvatarFallback>{getInitials()}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex gap-2">
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    className="text-red-500"
                                    onClick={handleDeletePicture}
                                >
                                    Delete
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('profile-picture-input')?.click()}
                                >
                                    Upload new picture
                                </Button>
                                <input
                                    id="profile-picture-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">First name</label>
                                <Input 
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleInputChange}
                                    placeholder="John" 
                                    className="bg-white dark:bg-black" 
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">Last name</label>
                                <Input 
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleInputChange}
                                    placeholder="Milton" 
                                    className="bg-white dark:bg-black" 
                                />
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1 dark:text-white">Contact Information</h3>
                        <p className="text-sm text-gray-500 mb-4 dark:text-white">Type your contact information.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Input 
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        type="email" 
                                        placeholder="oliverjack@gmail.com" 
                                        className="pl-10 bg-white dark:bg-black"
                                    />
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">Phone Number</label>
                                <div className="flex gap-2">
                                    <Select
                                        value={'bd'}
                                        onValueChange={(value) => handleSelectChange('country_code', value)}
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gb">🇬🇧 (+44)</SelectItem>
                                            <SelectItem value="bd">🇧🇩 (+880)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        placeholder="1632 960001" 
                                        className="flex-1 bg-white dark:bg-black" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <h3 className="font-medium text-gray-900 mb-1 dark:text-white">Location</h3>
                        <p className="text-sm text-gray-500 mb-4 dark:text-white">Select your current location.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">Country</label>
                                <Select 
                                    value={'bd'}
                                    onValueChange={(value) => handleSelectChange('country', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                                        <SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1.5 block dark:text-gray-300">City</label>
                                <Select 
                                    value={profileData.city}
                                    onValueChange={(value) => handleSelectChange('city', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="london">London</SelectItem>
                                        <SelectItem value="manchester">Manchester</SelectItem>
                                        <SelectItem value="dhaka">Dhaka</SelectItem>
                                        <SelectItem value="chittagong">Chittagong</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            type="button"
                            variant="outline" 
                            className="px-6" 
                            onClick={() => fetchProfileData()}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            className="px-6 bg-blue-600 hover:bg-blue-700 dark:text-gray-300"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </ScrollArea>
            </form>
        </div>
    );
};

export default GeneralSettings;