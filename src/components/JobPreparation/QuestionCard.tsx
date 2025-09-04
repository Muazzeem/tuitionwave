import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { Question } from '@/types/jobPreparation';
import { AnswerResult } from '@/types/common';

interface QuestionCardProps {
  question: Question;
  isAnswered?: boolean;
  showResult?: boolean;
  selectedOption?: string;
  result?: AnswerResult;
  onOptionSelect?: (questionUid: string, optionLabel: string) => void;
  mode: 'practice' | 'reading';
  questionNumber: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isAnswered = false,
  showResult = false,
  selectedOption,
  result,
  onOptionSelect,
  mode, questionNumber
}) => {
  const handleOptionClick = (optionLabel: string) => {
    if (mode === 'practice' && !isAnswered && onOptionSelect) {
      onOptionSelect(question.uid, optionLabel);
    }
  };

  return (
    <Card className="border-0 shadow-md bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-background border-b p-3 sm:p-4 border-gray-700">
        <CardTitle className="flex items-start justify-between gap-3">  
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${mode === 'reading' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-blue-600'
              }`}>
              {questionNumber}
            </div>
            <span className="text-sm sm:text-base leading-relaxed text-white">
              {question.question_text}
            </span>
          </div>

          {mode === 'reading' ? (
            <Badge className="bg-green-800 text-green-100 flex-shrink-0">
              Study
            </Badge>
          ) : (
            isAnswered && (
              <Badge
                variant={result?.is_correct ? "default" : "destructive"}
                className={`${result?.is_correct
                  ? 'bg-green-800 text-green-100 border-green-600'
                  : 'bg-red-800 text-red-100 border-red-600'
                  } px-2 py-1 text-xs font-medium flex-shrink-0`}
              >
                {result?.is_correct ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Correct</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Incorrect</span>
                    <span className="sm:hidden">✗</span>
                  </>
                )}
              </Badge>
            )
          )}
        </CardTitle>
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

        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 mb-4">
          {question.options.map((option) => {
            let optionClassName = 'p-2 sm:p-3 border-2 rounded-lg transition-all duration-200';

            if (mode === 'reading') {
              if (option.is_correct) {
                optionClassName += ' bg-green-900/20 border-green-600';
              } else {
                optionClassName += ' bg-gray-700 border-gray-600';
              }
            } else {
              if (selectedOption === option.option_label) {
                if (isAnswered) {
                  if (result?.is_correct && option.option_label === result.correct_option_label) {
                    optionClassName += ' bg-green-900/20 border-green-600';
                  } else if (!result?.is_correct && option.option_label === selectedOption) {
                    optionClassName += ' bg-red-900/20 border-red-600';
                  }
                } else {
                  optionClassName += ' bg-blue-900/20 border-blue-600';
                }
              } else if (isAnswered && showResult && option.option_label === result?.correct_option_label) {
                optionClassName += ' bg-green-900/20 border-green-600';
              } else {
                optionClassName += ' bg-gray-700 border-gray-600';
                if (mode === 'practice' && !isAnswered) {
                  optionClassName += ' hover:bg-blue-900/20 hover:border-blue-300 cursor-pointer';
                }
              }
            }

            return (
              <div
                key={option.uid}
                className={optionClassName}
                onClick={() => handleOptionClick(option.option_label)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-xs sm:text-sm flex-shrink-0 ${mode === 'reading' && option.is_correct
                        ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-white'
                      }`}>
                      {option.option_label}
                    </div>
                    <span className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                      {option.option_text}
                    </span>
                  </div>

                  {mode === 'reading' && option.is_correct && (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                  )}

                  {mode === 'practice' && isAnswered && showResult && (
                    <>
                      {option.option_label === result?.correct_option_label && (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 flex-shrink-0" />
                      )}
                      {option.option_label === selectedOption && !result?.is_correct && (
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                      )}
                    </>
                  )}

                  {mode === 'practice' && selectedOption === option.option_label && !isAnswered && (
                    <div className="animate-pulse flex-shrink-0">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {((mode === 'reading' && question.explanation) ||
          (mode === 'practice' && isAnswered && showResult && result?.explanation)) && (
          <div className="p-2 sm:p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-3">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-blue-200 mb-1 text-xs sm:text-sm flex items-center">
                  Explanation
                </h4>
                  <p className="text-blue-300 text-xs sm:text-sm leading-relaxed">
                    {mode === 'reading' ? question.explanation : result?.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

        {question.negative_marks > 0 && (
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-orange-900/20 rounded-lg">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="text-orange-300 font-medium text-xs sm:text-sm">
              Negative marks: {question.negative_marks}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;