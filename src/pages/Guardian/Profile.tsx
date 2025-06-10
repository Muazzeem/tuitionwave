
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';
import PackageSettings from '@/components/PackageSettings';
import DashboardHeader from '@/components/DashboardHeader';

const GuardianProfile = () => {
    return (
        <div className="flex-1 dark:bg-gray-900">
            <DashboardHeader userName="Mamun" />
            <div className="p-6 max-w-[1211px] mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-800">
                    <Tabs defaultValue="general" className="w-full dark:bg-gray-800">
                        <div className="px-4 pt-4">
                            <TabsList className="w-fit space-x-1 bg-gray-100 p-1 rounded-lg h-auto dark:bg-gray-800">
                                <TabsTrigger 
                                    value="general"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-black"
                                >
                                    General
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="password"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-black"
                                >
                                    Password
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="package"
                                    className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-black"
                                >
                                    Package
                                </TabsTrigger>
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
        </div>
    );
};

export default GuardianProfile;
