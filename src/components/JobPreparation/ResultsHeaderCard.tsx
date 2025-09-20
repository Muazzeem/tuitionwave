import { CheckCircle2, XCircle, HelpCircle, Target, Clock } from "lucide-react";

type Props = {
    examResults: {
        percentage: number;
        obtained_marks: number;
        total_marks: number;
        correct_answers: number;
        incorrect_answers: number;
        unanswered: number;
        resultStatus: string;
    };
    timeTakenLabel: number;
    onReview: () => void;
};

export default function ResultsHeaderCard({
    examResults,
    timeTakenLabel,
    onReview,
}: Props) {
    const accuracyRate = Math.round(
        (examResults.correct_answers /
            Math.max(
                1,
                examResults.correct_answers +
                examResults.incorrect_answers +
                examResults.unanswered
            )) * 100
    );

    return (
        <div className="w-full rounded-3xl border-0 bg-background p-5 sm:p-6 lg:p-5 text-slate-100">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left badges */}
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                        {examResults.percentage.toFixed(1)}%
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-6 text-slate-300/80">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 opacity-80" />
                            <span className="text-sm">
                                {examResults.obtained_marks}/{examResults.total_marks} Marks
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-80" />
                            <span className="text-sm">{timeTakenLabel} Taken</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onReview}
                        className="rounded-full bg-[#1767FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1259db]"
                    >
                        Review Answers
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Badge
                        icon={<CheckCircle2 className="h-6 w-6" />}
                        bg="bg-emerald-500/10"
                        ring="ring-emerald-500/30"
                        text="text-emerald-300"
                        value={examResults.correct_answers}
                        label="Correct"
                    />
                    <Badge
                        icon={<XCircle className="h-6 w-6" />}
                        bg="bg-rose-500/10"
                        ring="ring-rose-500/30"
                        text="text-rose-300"
                        value={examResults.incorrect_answers}
                        label="Incorrect"
                    />
                    <Badge
                        icon={<HelpCircle className="h-6 w-6" />}
                        bg="bg-amber-500/10"
                        ring="ring-amber-500/30"
                        text="text-amber-300"
                        value={examResults.unanswered}
                        label="Skipped"
                    />
                    <Badge
                        icon={<Target className="h-6 w-6" />}
                        bg="bg-teal-500/10"
                        ring="ring-teal-500/30"
                        text="text-teal-300"
                        value={`${accuracyRate}%`}
                        label="Accuracy"
                    />
                </div>
            </div>
        </div>
    );
}

function Badge({
    icon,
    bg,
    ring,
    text,
    value,
    label,
}: {
    icon: React.ReactNode;
    bg: string;
    ring: string;
    text: string;
    value: number | string;
    label: string;
}) {
    const padded =
        typeof value === "number" ? (value < 10 ? `0${value}` : `${value}`) : value;

    return (
        <div
            className={`flex items-center gap-3 rounded-2xl ${bg} ${ring} ring-1 px-4 py-3`}
        >
            <div className={`${text}`}>{icon}</div>
            <div className={`whitespace-nowrap text-base font-semibold ${text}`}>
                <span className="tabular-nums">{padded}</span>{" "}
                <span className="font-medium opacity-90">{label}</span>
            </div>
        </div>
    );
}
