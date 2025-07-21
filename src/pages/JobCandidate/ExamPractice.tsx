import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function ExamPractice() {
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [topics, setTopics] = useState("");
    return (
        <div className="flex-1 overflow-auto dark:bg-gray-900">
            <DashboardHeader userName="John" />

            <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 dark:text-white">Create Practice Exam</h2>
                </div>

                <div className="p-4 md:p-6">
                    <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
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
                                    <Select value={category} onValueChange={setCategory}>
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
                                    <Select value={topics} onValueChange={setTopics}>
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
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
