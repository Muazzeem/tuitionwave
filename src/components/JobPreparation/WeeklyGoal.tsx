import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { getAccessToken } from "@/utils/auth";

type WeeklyGoalData = {
    weeklyGoal: number;
    weeklyCompleted: number;
};

export default function WeeklyGoal() {
    const [data, setData] = useState<WeeklyGoalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = getAccessToken();
        const fetchWeeklyGoal = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/goals/weekly-model-tests/`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch weekly goal");
                }

                const json = await res.json();

                setData({
                    weeklyGoal: 7,
                    weeklyCompleted: json.total_completed_model_tests,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyGoal();
    }, []);

    if (loading) {
        return (
            <Card className="bg-background border-gray-900 shadow-xl rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Weekly Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* title skeleton */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-20 bg-gray-700" />
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                        </div>
                        {/* progress bar skeleton */}
                        <Skeleton className="h-3 w-full rounded-full bg-gray-700" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="bg-background border-gray-900 shadow-xl rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Weekly Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-400">Failed to load data</p>
                </CardContent>
            </Card>
        );
    }

    const progress = (data.weeklyCompleted / data.weeklyGoal) * 100;

    return (
        <Card className="bg-background border-gray-900 shadow-xl rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                    Weekly Goal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white pb-2">
                        <span>Progress</span>
                        <span>
                            {data.weeklyCompleted}/{data.weeklyGoal} exams
                        </span>
                    </div>
                    <Progress value={progress} />
                </div>
            </CardContent>
        </Card>
    );
}
