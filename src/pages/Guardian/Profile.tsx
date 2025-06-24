
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';
import DashboardHeader from '@/components/DashboardHeader';
import { ScrollArea } from "@/components/ui/scroll-area";

const GuardianProfile = () => {
    return (
        <div className="flex-1 dark:bg-gray-900">
            <DashboardHeader userName="Mamun" />
            <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
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
            </ScrollArea>
        </div>
    );
};

export default GuardianProfile;
