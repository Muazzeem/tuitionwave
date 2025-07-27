
import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar } from "lucide-react";

export default function CreateModelTest() {
  const [selectedTab, setSelectedTab] = useState("running");
  const [bankExam, setBankExam] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("");

  const tabs = [
    { id: "running", label: "Running Exams" },
    { id: "upcoming", label: "Upcoming Exams" },
    { id: "expired", label: "Expired Exams" }
  ];

  const examCards = [
    {
      title: "English Grammar",
      description: "Comprehensive test covering tenses, articles, prepositions and...",
      date: "04 Jan 2025",
      time: "11:00 AM - 01:00 PM",
      duration: "120 min",
      participants: "128 participants",
      category: "BCS",
      timeLeft: "01:24:36",
      status: "running"
    },
    {
      title: "Mathematics",
      description: "Advanced problem solving with algebra, geometry, and calculus...",
      date: "04 Jan 2025",
      time: "09:00 AM - 11:00 AM",
      duration: "120 min",
      participants: "95 participants",
      category: "Bank",
      timeLeft: "00:42:15",
      status: "running"
    },
    {
      title: "General Knowledge",
      description: "Current affairs, history, geography and science for competitive exams.",
      date: "04 Jan 2025",
      time: "02:00 PM - 04:00 PM",
      duration: "120 min",
      participants: "156 participants",
      category: "BCS",
      timeLeft: "02:15:44",
      status: "running"
    }
  ];

  const filteredExams = examCards.filter(exam => exam.status === selectedTab);

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Model Tests</h1>
            <p className="text-gray-400">Create and practise preliminary model exams</p>
          </div>

          {/* Create Model Test Section */}
          {/* <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="dark:text-white text-lg">Create Model Test</CardTitle>
                <p className="text-gray-400 text-sm">Customize your exam parameters</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">Categories</label>
                  <Select value={bankExam} onValueChange={setBankExam}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="BCS" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="bcs">BCS</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="ntrca">NTRCA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">Subject(s)</label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="general">General Knowledge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-300">Topic(s)</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="bangla">Bangla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-0 dark:bg-gray-800 rounded-lg p-1 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white dark:hover:bg-gray-700 hover:bg-blue-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
      {filteredExams.map((exam, index) => (
        <Card 
          key={index} 
          // Background and border colors adapt to dark mode
          className="bg-gray-100 border-gray-200 hover:border-gray-300 transition-colors
                     dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Exam Title and Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{exam.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{exam.description}</p>
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span>{exam.time}</span>
                </div>
              </div>

              {/* Category Badge and Duration */}
              <div className="flex items-center justify-between">
                <Badge 
                  variant={exam.category === "BCS" ? "default" : "secondary"}
                  // Badge background colors adapt to dark mode
                  className={exam.category === "BCS" 
                    ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white" 
                    : "bg-orange-600 text-white dark:bg-orange-700 dark:text-white"
                  }
                >
                  {exam.category}
                </Badge>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{exam.duration}</span>
              </div>

              {/* Participants and Time Left */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <Users className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                  <span>{exam.participants}</span>
                </div>
                <div className="text-right">
                  <div className="text-orange-500 font-mono text-sm font-semibold dark:text-orange-400">
                    {exam.timeLeft}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

          {/* Empty State */}
          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No {selectedTab} exams</div>
              <p className="text-gray-500">Check back later for more exam opportunities</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
