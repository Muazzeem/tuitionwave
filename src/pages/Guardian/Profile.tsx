
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/GeneralSettings';
import PasswordSettings from '@/components/PasswordSettings';
import DashboardHeader from '@/components/DashboardHeader';
import { ScrollArea } from "@/components/ui/scroll-area";

const GuardianProfile = () => {
    return (
        <div className="flex-1 bg-gray-900 min-h-screen">
            <DashboardHeader userName="Mamun" />
            <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="flex justify-center pt-10 pb-20">
                    <div className="w-full max-w-5xl bg-background border border-gray-700 rounded-lg">
                        <div className="rounded-lg">
                            <Tabs defaultValue="general" className="w-full bg-background">
                                <div className="px-4 pt-4">
                                    <TabsList className="w-fit space-x-1 bg-gray-100 p-1 rounded-lg h-auto bg-background">
                                        <TabsTrigger
                                            value="general"
                                            className="rounded-md px-6 py-2 data-[state=active]:bg-white :shadow-sm data-[state=active]:bg-primary-500"
                                        >
                                            General
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="password"
                                            className="rounded-md px-6 py-2 data-[state=active]:bg-white :shadow-sm data-[state=active]:bg-primary-500"
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
            </ScrollArea>
        </div>
    );
};

export default GuardianProfile;
