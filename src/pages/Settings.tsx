
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';

const Settings = () => {
    return (
        <div className="flex-1 overflow-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-gray-500">Manage settings and configurations of dashboard.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-gray-500" />
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://randomuser.me/api/portraits/men/43.jpg" alt="Profile" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">Tutor Name</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg mt-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="w-fit border rounded-lg p-1 bg-transparent">
                            <TabsTrigger 
                                value="general"
                                className="rounded-md px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-none"
                            >
                                General
                            </TabsTrigger>
                            <TabsTrigger 
                                value="password"
                                className="rounded-md px-6 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-none"
                            >
                                Password
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="general">
                            <GeneralSettings />
                        </TabsContent>
                        <TabsContent value="password">
                            <PasswordSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Settings;
