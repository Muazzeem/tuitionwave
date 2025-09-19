import React from "react";
import { ArrowLeft, Target, Trophy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Option = {
    uid: string;
    label: string;
    text: string;
    is_correct: boolean;
};

type Props = {
    examResults: {
        questions: any;
    };
    onBackToResults: () => void;
    onPracticeMore: () => void;
    onGoToDashboard: () => void;
};

export default function ReviewAnswers({
    examResults,
    onBackToResults,
    onPracticeMore,
    onGoToDashboard,
}: Props) {
    return (
        <ScrollArea type="always" style={{ height: "calc(110vh - 180px)" }}>
            <div className="mx-auto px-4 py-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {examResults.questions.map((question, index) => (
                        <Card key={question.uid} className="bg-background border-0 rounded-lg">
                            <CardHeader className="p-3 sm:p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 md:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm md:text-md font-semibold text-white">
                                                {question.question_text}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-3 sm:p-4">
                                {question.image && (
                                    <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={question.image}
                                            alt="Question illustration"
                                            className="w-full max-h-48 sm:max-h-64 object-contain bg-gray-700"
                                        />
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-2 gap-2 sm:gap-3 mb-4">
                                    {question.options.map((option) => (
                                        <AnswerOptionRow
                                            key={option.uid}
                                            option={option}
                                            selectedOptionUid={question.selected_option?.uid ?? null}
                                        />
                                    ))}
                                </div>

                                {question.explanation && (
                                    <div className="lg:col-span-2 mt-3 p-2 md:p-5 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-xl">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-blue-200 mb-2">Explanation</h4>
                                                <p className="text-blue-300 leading-relaxed">{question.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Button
                            onClick={onBackToResults}
                            variant="outline"
                            className="flex-1 sm:flex-none bg-background border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Results
                        </Button>

                        <Button
                            onClick={onPracticeMore}
                            variant="outline"
                            className="flex-1 sm:flex-none bg-background border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                        >
                            <Target className="h-4 w-4 mr-2" />
                            Practice More
                        </Button>

                        <Button
                            onClick={onGoToDashboard}
                            className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                            <Trophy className="h-4 w-4 mr-2" />
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}

function AnswerOptionRow({
    option,
    selectedOptionUid,
}: {
    option: Option;
    selectedOptionUid: string | null;
}) {
    const isUserSelected = option.uid === selectedOptionUid;
    const isCorrect = option.is_correct;
    const isWrongSelected = isUserSelected && !isCorrect;

    let optionClass =
        "p-1 rounded-xl border-2 transition-all duration-200 text-sm";
    let badgeEl: React.ReactNode = null;

    if (isCorrect) {
        optionClass += " bg-green-900/20 border-green-600";
        badgeEl = (
            <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                Correct Answer
            </Badge>
        );
    } else if (isWrongSelected) {
        optionClass += " bg-red-900/20 border-red-600";
        badgeEl = (
            <Badge variant="destructive" className="bg-red-600 text-white text-xs px-2 py-0.5">
                Your Answer
            </Badge>
        );
    } else if (isUserSelected) {
        optionClass += " bg-blue-900/20 border-blue-600";
    } else {
        optionClass += " bg-gray-700 border-gray-600 hover:bg-gray-600";
    }

    return (
        <div className={optionClass}>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 flex-1">
                    <span className="font-semibold text-sm text-gray-300 bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center">
                        {option.label}
                    </span>
                    <span className="text-white flex-1">{option.text}</span>
                </div>
                <div className="hidden md:block">{badgeEl}</div>
            </div>
        </div>
    );
}

