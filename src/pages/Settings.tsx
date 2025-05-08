
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';
import DashboardHeader from '@/components/DashboardHeader';

const Settings = () => {
    return (
        <div className="flex-1 bg-white dark:bg-gray-900">
            <DashboardHeader userName="Settings" />
            <div className="p-6 max-w-[1211px] mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Tabs defaultValue="general" className="w-full">
                        <div className="px-4 pt-4">
                            <TabsList className="w-fit space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg h-auto">
                                <TabsTrigger 
                                    value="general"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                                >
                                    General
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="password"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
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
