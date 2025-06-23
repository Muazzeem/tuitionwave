
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';
import PackageSettings from '@/components/PackageSettings';
import DashboardHeader from '@/components/DashboardHeader';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
    const { userProfile } = useAuth();
    console.log(userProfile);
    return (
        <div className="flex-1 bg-white dark:bg-gray-900">
            <DashboardHeader userName="Settings" />
            <ScrollArea type="always" style={{ height: 800 }}>
            <div className="p-4 sm:p-6 max-w-full lg:max-w-[1211px] mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Tabs defaultValue="general" className="w-full">
                        <div className="px-2 sm:px-4 pt-4">
                            <TabsList className="w-full sm:w-fit flex sm:space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg h-auto">
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
                                {(userProfile.package.package_expiry_date &&
                                    <TabsTrigger 
                                    value="package"
                                    className="flex-1 sm:flex-none rounded-md px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                                >
                                    Package
                                </TabsTrigger>
                                )}
                            </TabsList>
                        </div>
                        <TabsContent value="general" className="mt-0">
                            <GeneralSettings />
                        </TabsContent>
                        <TabsContent value="password" className="mt-0">
                            <PasswordSettings />
                        </TabsContent>
                        <TabsContent value="package" className="mt-0">
                            <PackageSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            </ScrollArea>
        </div>
    );
};

export default Settings;
