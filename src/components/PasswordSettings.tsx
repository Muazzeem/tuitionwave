import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import { getAccessToken } from '@/utils/auth';
import { useToast } from './ui/use-toast';

const PasswordSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { toast } = useToast();
    const apiEndpoint = `${import.meta.env.VITE_API_URL}/auth/password/change/`; // Your API endpoint
    const accessToken = getAccessToken();

    const handleChangePassword = async () => {

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields.",
                variant: "destructive"
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive"
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                title: "Error",
                description: "New password must be at least 8 characters long.",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsSaving(true);
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Include your authentication token
                },
                body: JSON.stringify({
                    password: currentPassword,
                    new_password1: newPassword,
                    new_password2: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Password changed successfully!",
                });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Handle API errors, you might want to display specific error messages from the backend
                toast({
                    title: "Error",
                    description: data?.detail || 'Failed to change password. Please try again.',
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        }
        finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="p-6 space-y-8 dark:bg-gray-800 dark:border-gray-700">
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h2>
                <p className="text-gray-500 mt-1 dark:text-gray-300">Manage and change your password</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-medium text-gray-900 mb-1 dark:text-gray-300">Current Password</h3>
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white dark:bg-black"
                            placeholder="Current password "
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3"
                        >
                            {showCurrentPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-1 dark:text-white">New Password</h3>
                    <p className="text-sm text-gray-500 mb-2 dark:text-gray-300">Type your new unique password.</p>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white dark:bg-black"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3"
                        >
                            {showNewPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">Minimum of 8 characters or more.</p>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-1 dark:text-white">Confirm New Password</h3>
                    <p className="text-sm text-gray-500 mb-2 dark:text-gray-300">Re-enter your new password.</p>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white dark:bg-black"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3"
                        >
                            {showConfirmPassword ? (
                                <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="px-6">Cancel</Button>
                <Button className="px-6 bg-blue-600 hover:bg-blue-700 dark:text-gray-300"
                disabled={isSaving}
                onClick={handleChangePassword}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default PasswordSettings;
