
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";

const PasswordSettings = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Password</h2>
                <p className="text-gray-500 mb-6">Manage and change your password</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="font-medium">Current Password</label>
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Enter current password"
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
                    <label className="font-medium">New Password</label>
                    <p className="text-sm text-gray-500">Type your new unique password.</p>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Enter new password"
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
                    <p className="text-sm text-gray-500 mt-1">Minimum of 8 characters or more.</p>
                </div>

                <div className="space-y-2">
                    <label className="font-medium">Confirm New Password</label>
                    <p className="text-sm text-gray-500">Re-enter your new password.</p>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            placeholder="Confirm new password"
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

            <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default PasswordSettings;
