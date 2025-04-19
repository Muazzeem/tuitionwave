
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";

const PasswordSettings = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="p-6 space-y-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                <p className="text-gray-500 mt-1">Manage and change your password</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-medium text-gray-900 mb-1">Current Password</h3>
                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white"
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

                <div>
                    <h3 className="font-medium text-gray-900 mb-1">New Password</h3>
                    <p className="text-sm text-gray-500 mb-2">Type your new unique password.</p>
                    <div className="relative">
                        <Input
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white"
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
                    <p className="text-sm text-gray-500 mt-2">Minimum of 8 characters or more.</p>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-1">Confirm New Password</h3>
                    <p className="text-sm text-gray-500 mb-2">Re-enter your new password.</p>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10 bg-white"
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

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="px-6">Cancel</Button>
                <Button className="px-6 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
        </div>
    );
};

export default PasswordSettings;
