
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

const GeneralSettings = () => {
    return (
        <div className="p-6 space-y-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">General</h2>
                <p className="text-gray-500 mt-1">Manage general settings for your account</p>
            </div>

            <div>
                <h3 className="font-medium text-gray-900 mb-1">Profile Picture</h3>
                <p className="text-sm text-gray-500 mb-4">Upload an profile image.</p>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="/lovable-uploads/cac7a580-de37-4fc4-87dc-873b140acf81.png" alt="Profile" />
                        <AvatarFallback>TN</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-red-500">Delete</Button>
                        <Button variant="outline">Upload new picture</Button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-gray-900 mb-1">Your Name</h3>
                <p className="text-sm text-gray-500 mb-4">Type your first and last name.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">First name</label>
                        <Input placeholder="John" className="bg-white" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Last name</label>
                        <Input placeholder="Milton" className="bg-white" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-gray-900 mb-1">Contact Information</h3>
                <p className="text-sm text-gray-500 mb-4">Type your contact information.</p>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Email Address</label>
                        <div className="relative">
                            <Input 
                                type="email" 
                                placeholder="oliverjack@gmail.com" 
                                className="pl-10 bg-white"
                            />
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Phone Number</label>
                        <div className="flex gap-2">
                            <Select defaultValue="gb">
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gb">🇬🇧 (+44)</SelectItem>
                                    <SelectItem value="us">🇺🇸 (+1)</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input placeholder="1632 960001" className="flex-1 bg-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                <p className="text-sm text-gray-500 mb-4">Select your global location.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">Country</label>
                        <Select defaultValue="uk">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                                <SelectItem value="us">🇺🇸 United States</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1.5 block">City</label>
                        <Select defaultValue="london">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="london">London</SelectItem>
                                <SelectItem value="manchester">Manchester</SelectItem>
                            </SelectContent>
                        </Select>
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

export default GeneralSettings;
