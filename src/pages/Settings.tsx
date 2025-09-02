import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/GeneralSettings";
import PasswordSettings from "@/components/PasswordSettings";
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

const getUserTypeFromUrl = (pathname: string): string => {
  const segments = pathname.toLowerCase().split('/');

  if (segments.includes('teacher')) {
    return 'TEACHER';
  }

  return 'GUARDIAN';
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState(() => getUserTypeFromUrl(window.location.pathname) === 'GUARDIAN' ? 'general' : 'password');

  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <DashboardHeader userName="Settings" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 sm:p-6">
          <h1 className="lg:text-3xl sm:text-2xl font-bold">Settings</h1>
          <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {getUserTypeFromUrl(window.location.pathname) === 'GUARDIAN' && (
                  <div className="px-2 sm:px-4 pt-4">
                    <TabsList className="w-full sm:w-fit flex sm:space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg h-auto">
                      <>
                        <TabsTrigger
                          value="general"
                          className="flex-1 sm:flex-none rounded-md px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          General
                        </TabsTrigger>
                        <TabsTrigger
                          value="password"
                          className="flex-1 sm:flex-none rounded-md px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                        >
                          Password
                        </TabsTrigger>
                      </>
                    </TabsList>
                  </div>
                )}

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
      </ScrollArea>
    </div>
  );
};

export default Settings;
