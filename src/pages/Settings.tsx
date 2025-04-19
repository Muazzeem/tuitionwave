
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from '@/components/DashboardHeader';
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';

const Settings = () => {
    return (
        <div className="flex-1 overflow-auto">
            <DashboardHeader userName="John" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-500">Manage settings and configurations of dashboard.</p>
                </div>

                <div className="bg-white rounded-lg p-6">
                    <Tabs defaultValue="general">
                        <TabsList>
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
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
