
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';

const Settings = () => {
    return (
        <div className="flex-1">
            <div className="p-6 max-w-[1211px] mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                        <p className="text-gray-500 mt-1">Manage settings and configurations of dashboard.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-gray-600" />
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/lovable-uploads/cac7a580-de37-4fc4-87dc-873b140acf81.png" alt="Profile" />
                                <AvatarFallback>TN</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">Tutor Name</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <Tabs defaultValue="general" className="w-full">
                        <div className="px-4 pt-4">
                            <TabsList className="w-fit space-x-1 bg-gray-100 p-1 rounded-lg h-auto">
                                <TabsTrigger 
                                    value="general"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    General
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="password"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Password
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="general" className="mt-0">
                            <GeneralSettings />
                        </TabsContent>
                        <TabsContent value="password" className="mt-0">
                            <PasswordSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Settings;
