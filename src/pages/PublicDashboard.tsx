import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

const PublicDashboard = () => {
  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PublicDashboard;

