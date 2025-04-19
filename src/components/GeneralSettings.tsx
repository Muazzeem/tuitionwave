
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const GeneralSettings = () => {
    return (
        <div className="space-y-8 p-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">General</h2>
                <p className="text-gray-500">Manage general settings for your account</p>
            </div>

            <div className="space-y-2">
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-gray-500">Upload an profile image.</p>
                <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://randomuser.me/api/portraits/men/43.jpg" alt="Profile" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-red-500">Delete</Button>
                        <Button variant="outline">Upload new picture</Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-medium">Your Name</h3>
                <p className="text-sm text-gray-500">Type your first and last name.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm">First name</label>
                        <Input placeholder="John" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">Last name</label>
                        <Input placeholder="Milton" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <p className="text-sm text-gray-500">Type your contact information.</p>
                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm">Email Address</label>
                        <Input type="email" placeholder="oliverjack@gmail.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">Phone Number</label>
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
                            <Input placeholder="1632 960001" className="flex-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-gray-500">Select your global location.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                        <label className="text-sm">Country</label>
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
                    <div className="space-y-2">
                        <label className="text-sm">City</label>
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

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
        </div>
    );
};

export default GeneralSettings;
