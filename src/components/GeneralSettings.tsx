
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeneralSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">General</h2>
                <p className="text-gray-500 mb-6">Manage general settings for your account</p>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-base font-medium mb-2">Profile Picture</h3>
                    <p className="text-sm text-gray-500 mb-4">Upload an profile image.</p>
                    <div className="flex items-center gap-4">
                        <img
                            src="https://randomuser.me/api/portraits/men/43.jpg"
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-red-500 hover:text-red-600">
                                Delete
                            </Button>
                            <Button variant="outline">Upload new picture</Button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-2">Your Name</h3>
                    <p className="text-sm text-gray-500 mb-4">Type your first and last name.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">First name</label>
                            <Input placeholder="John" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm">Last name</label>
                            <Input placeholder="Milton" className="mt-1" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-500 mb-4">Type your contact information.</p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm">Email Address</label>
                            <Input 
                                type="email" 
                                placeholder="oliverjack@gmail.com" 
                                className="mt-1" 
                            />
                        </div>
                        <div>
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

                <div>
                    <h3 className="text-base font-medium mb-2">Location</h3>
                    <p className="text-sm text-gray-500 mb-4">Select your global location.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
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
                        <div>
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
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    );
};

export default GeneralSettings;
