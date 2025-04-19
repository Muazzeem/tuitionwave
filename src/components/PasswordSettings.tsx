
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";

const PasswordSettings = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">Password</h2>
                <p className="text-gray-500">Manage and change your password</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-medium">Current Password</h3>
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Current password"
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

                <div className="space-y-2">
                    <h3 className="font-medium">New Password</h3>
                    <p className="text-sm text-gray-500">Type your new unique password.</p>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="New password"
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
                    <p className="text-sm text-gray-500">Minimum of 8 characters or more.</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Confirm New Password</h3>
                    <p className="text-sm text-gray-500">Re-enter your new password.</p>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Confirm password"
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

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
        </div>
    );
};

export default PasswordSettings;
