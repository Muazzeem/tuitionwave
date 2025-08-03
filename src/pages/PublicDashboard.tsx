
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Brain,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const PublicDashboard = () => {
  useEffect(() => {
    document.title = "Tuition Wave | Dashboard";
  }, []);

  // Mock stats data
  const platformStats = {
    totalUsers: 15420,
    activeTutors: 3240,
    totalGuardians: 8150,
    bcsStudents: 4030,
  };

  const dashboardFeatures = [
    {
      title: "Guardian Dashboard",
      description: "Complete parental control and tutor management system",
      icon: Shield,
      color: "bg-blue-500",
      link: "/dashboard/guardian",
      features: [
        "Find and hire qualified tutors",
        "Monitor child's learning progress",
        "Manage tuition requests and contracts",
        "Direct communication with tutors",
        "Payment and schedule management",
        "Safety and background verification"
      ],
      stats: {
        activeUsers: platformStats.totalGuardians,
        satisfaction: "96%",
        avgResponse: "< 2 hours"
      }
    },
    {
      title: "Tutor Dashboard",
      description: "Professional teaching platform for educators",
      icon: GraduationCap,
      color: "bg-green-500",
      link: "/dashboard/teacher",
      features: [
        "Create and manage teaching profile",
        "Receive and respond to tuition requests",
        "Schedule management and calendar",
        "Student progress tracking",
        "Earnings and payment history",
        "Professional development resources"
      ],
      stats: {
        activeUsers: platformStats.activeTutors,
        satisfaction: "94%",
        avgEarning: "৳25K/month"
      }
    },
    {
      title: "Job Preparation",
      description: "Comprehensive BCS exam preparation platform",
      icon: Brain,
      color: "bg-purple-500",
      link: "/job-preparation/dashboard",
      features: [
        "Custom exam creation and practice",
        "Subject-wise question banks",
        "Reading materials and study guides",
        "Performance analytics and ranking",
        "Progress tracking and goals",
        "Mock tests and time management"
      ],
      stats: {
        activeUsers: platformStats.bcsStudents,
        satisfaction: "92%",
        passRate: "78%"
      }
    }
  ];

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="User" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6">
          {/* Welcome Section */}


          <div className="p-6 w-11/12 md:w-9/12 lg:w-9/12 mx-auto">
            {/* Platform Stats */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to TuitionMaster Platform
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Your all-in-one educational ecosystem connecting guardians, tutors, and BCS candidates
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-foreground">{platformStats.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-foreground">{platformStats.activeTutors.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Active Tutors</div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-foreground">{platformStats.totalGuardians.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Guardians</div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold text-foreground">{platformStats.bcsStudents.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">BCS Students</div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Features */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Choose Your Dashboard</h2>

              {dashboardFeatures.map((dashboard, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${dashboard.color}`}>
                          <dashboard.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{dashboard.title}</CardTitle>
                          <CardDescription className="text-lg mt-1">
                            {dashboard.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Link to={dashboard.link}>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                          Access Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Key Features:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {dashboard.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground">Platform Statistics:</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active Users</span>
                            <Badge variant="secondary">{dashboard.stats.activeUsers.toLocaleString()}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">User Satisfaction</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {dashboard.stats.satisfaction}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {dashboard.title === "Tutor Dashboard" ? "Avg Monthly Earning" :
                                dashboard.title === "BCS Candidate Dashboard" ? "Success Rate" : "Avg Response Time"}
                            </span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              {dashboard.title === "Tutor Dashboard" ? dashboard.stats.avgEarning :
                                dashboard.title === "BCS Candidate Dashboard" ? dashboard.stats.passRate : dashboard.stats.avgResponse}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Get started with our most popular features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link to="/guardian/find-tutors">
                      <Button variant="outline" className="w-full h-20 flex-col gap-2">
                        <Users className="h-6 w-6" />
                        <span>Find Tutors</span>
                      </Button>
                    </Link>

                    <Link to="/job-preparation/practice">
                      <Button variant="outline" className="w-full h-20 flex-col gap-2">
                        <FileText className="h-6 w-6" />
                        <span>Practice Exam</span>
                      </Button>
                    </Link>

                    <Link to="/message">
                      <Button variant="outline" className="w-full h-20 flex-col gap-2">
                        <MessageCircle className="h-6 w-6" />
                        <span>Messages</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PublicDashboard;
