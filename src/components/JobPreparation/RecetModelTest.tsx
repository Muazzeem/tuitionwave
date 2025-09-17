import { getAccessToken } from "@/utils/auth";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const API_URL = `${import.meta.env.VITE_API_URL}/api/model-tests?today=true`;

type ApiItem = {
    uid: string;
    name: string;
    description?: string;
    category?: { uid: string; category_no: number; category_name: string };
    is_active: boolean;
    user_exam?: { uid: string; status: "not_started" | "in_progress" | "completed" | "expired" | string; status_display?: string; percentage: number | null; };
    total_questions: number;
    scheduled_date: string;
    passing_mark: number;
    duration_minutes: number;
    created_at: string;
    expired_date?: string;
};

type ApiResponse = {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    results: ApiItem[];
};

const formatDateTime = (dateLike?: string) => {
    if (!dateLike) return "";
    const d = dateLike.length <= 10 ? new Date(`${dateLike}T00:00:00`) : new Date(dateLike);
    return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const LivePill: React.FC = () => (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 text-emerald-400 px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-emerald-500/30">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Live
    </span>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-slate-600/20 text-slate-300 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-slate-500/30">
        {children}
    </span>
);

const SkeletonRow: React.FC = () => (
    <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 sm:p-5 animate-pulse">
        <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
                <div className="h-4 w-48 bg-slate-700/50 rounded" />
                <div className="mt-2 h-3 w-36 bg-slate-700/40 rounded" />
                <div className="mt-2 h-3 w-28 bg-slate-700/30 rounded" />
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
                <div className="h-6 w-16 bg-slate-700/40 rounded" />
                <div className="h-10 w-28 bg-slate-700/60 rounded-full" />
            </div>
        </div>
    </div>
);

const LiveModelTests: React.FC = () => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    const accessToken = getAccessToken();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })
            .then(async (r) => {
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                const json = (await r.json()) as ApiResponse;
                if (mounted) setData(json);
            })
            .catch((e) => mounted && setErr(e.message || "Failed to load"))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const exams = useMemo(() => data?.results ?? [], [data]);
    const liveCount = data?.count;

    const handleStartExam = async (modelTest) => {
        const accessToken = getAccessToken();

        try {
            // Case 2: User has an exam in progress
            if (modelTest.user_exam && modelTest.user_exam.status === 'in_progress') {
                navigate(`/job-preparation/model-test/exam/${modelTest.user_exam.uid}`);
                return;
            }

            // Case 3: User has completed the exam
            if (modelTest.user_exam && modelTest.user_exam.status === 'completed') {
                navigate(`/job-preparation/exam/${modelTest.user_exam.uid}/results`);
                return;
            }

            // Case 4: No user exam exists, need to generate one
            if (!modelTest.user_exam) {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/model-tests/${modelTest.uid}/create-exam/`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to generate exam: ${response.status}`);
                }

                const data = await response.json();

                toast({
                    title: "Exam Generated!",
                    description: "Your exam has been created. Starting now...",
                    duration: 2000,
                });

                navigate(`/job-preparation/model-test/exam/${data.uid}`);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to process exam. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <section className="w-full hidden md:block bg-background border-gray-900 shadow-xl rounded-2xl p-4 sm:p-5 lg:min-h-80 ">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Live Model Test</h2>
                    <span className="rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium px-3 py-1 ring-1 ring-inset ring-blue-500/30 animate-pulse">
                        {liveCount} Live Exam
                    </span>
                </div>
                <div className="">
                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            <SkeletonRow />
                            <SkeletonRow />
                        </div>
                    ) : err ? (
                        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-red-200 text-sm">
                            Failed to load live tests. {err}
                        </div>
                    ) : exams.length === 0 ? (
                                <div className="rounded-xl text-center border border-slate-800 bg-background-600/40 p-6 text-slate-300 text-sm">
                                    Not available for today.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {exams.slice(-2).map((item) => {
                                const pct = typeof item.user_exam?.percentage === "number" ? item.user_exam!.percentage : 0;
                                const status = item.user_exam?.status ?? "not_started";
                                const isCompleted = status === "completed";
                                const isInProgress = status === "in_progress";
                                const ctaText = isCompleted ? "View Results" : isInProgress ? "Resume" : "Start Exam";

                                return (
                                    <article key={item.uid} className="rounded-xl border border-background-600 bg-background-600/40 p-0">
                                        <div className="p-4 sm:p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                {/* Left */}
                                                <div className="min-w-0">
                                                    <h3 className="flex items-center gap-2 text-slate-100 font-medium min-w-0 whitespace-nowrap">
                                                        <span className="truncate">{item.name}</span>
                                                        <span className="shrink-0 truncate hidden lg:block"><LivePill /></span>
                                                        <span className="truncate hidden lg:block">
                                                            {item.category?.category_name && (
                                                                <Tag>{item.category.category_name}</Tag>
                                                            )}
                                                        </span>
                                                    </h3>
                                                    <p className="mt-2 text-xs text-slate-400">
                                                        {formatDateTime(item.scheduled_date)}
                                                    </p>
                                                </div>

                                                {/* Right */}
                                                <div className="flex items-center gap-4 sm:gap-6">
                                                    <div className="text-right">
                                                        <div className="text-slate-100 text-lg font-semibold leading-none">
                                                            {pct.toFixed(2)}%
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-400">Your Progress</div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleStartExam(item)}
                                                        className="shrink-0 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium px-2 lg:px-4 py-2 hover:bg-blue-500"
                                                    >
                                                        {ctaText}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                            {liveCount >= 2 && (
                                <div className="flex items-center justify-center">
                                    <button className="px-3 py-1 w-20 rounded-full text-xs text-white bg-blue-600 border  border-background-700">
                                        See All
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <div className="mb-3 flex items-center justify-between block md:hidden">
                <h2 className="text-lg font-semibold text-white">Live Model Test</h2>
                <span className="rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium px-3 py-1 ring-1 ring-inset ring-blue-500/30 animate-pulse">
                    {liveCount} Live Exam
                </span>
            </div>
            {liveCount > 0 ? (
                <div className="sm:px-5 pb-4 overflow-x-auto block md:hidden">
                    <div className="flex gap-4">
                        {exams.map((item) => {
                            const pct =
                                typeof item.user_exam?.percentage === "number"
                                    ? item.user_exam!.percentage
                                    : 0;
                            const status = item.user_exam?.status ?? "not_started";
                            const isCompleted = status === "completed";
                            const isInProgress = status === "in_progress";
                            const ctaText = isCompleted
                                ? "View Results"
                                : isInProgress
                                    ? "Resume"
                                    : "Start Exam";

                            return (
                                <article
                                    key={item.uid}
                                    className="w-72 shrink-0 rounded-2xl border border-slate-800 bg-background p-4 md:p-5"
                                >
                                    {/* Progress pill */}
                                    <div className="mb-3 flex flex-col items-center justify-center rounded-xl bg-[#2F3B54] text-slate-200 px-3 py-2 w-full">
                                        <span className="text-xl font-semibold">
                                            {pct.toFixed(2)}%
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            Your Progress
                                        </span>
                                    </div>

                                        {/* Title */}
                                        <h3 className="text-slate-100 text-base sm:text-lg font-semibold leading-snug line-clamp-2 text-center">
                                            {item.name}
                                        </h3>

                                        {/* Badges row */}
                                        <div className="mt-2 flex justify-center items-center gap-2">
                                            <LivePill />
                                            {item.category?.category_name && (
                                                <Tag>{item.category.category_name}</Tag>
                                            )}
                                        </div>

                                        {/* Date */}
                                        <p className="mt-2 text-xs text-slate-400 text-center">
                                            {formatDateTime(item.scheduled_date)}
                                        </p>

                                    {/* CTA */}
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleStartExam(item)}
                                            className="w-full inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium px-3 py-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-400 transition"
                                        >
                                            {ctaText}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="block md:hidden rounded-xl text-center border border-slate-800 bg-background-600/40 p-6 text-slate-300 text-sm">
                    Not available for today.
                </div>
            )}
        </>

    )
};

export default LiveModelTests;