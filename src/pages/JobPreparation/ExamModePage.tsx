
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';

interface ExamState {
  [questionId: string]: {
    selectedOption?: string;
    isAnswered: boolean;
  };
}

const ExamModePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { categoryId, subjectId, topicId } = params;
  
  const [examState, setExamState] = useState<ExamState>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['exam-questions', topicId],
    queryFn: () => JobPreparationService.getQuestions(topicId!, 1),
    enabled: !!topicId,
  });

  const { data: topicData } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const topics = await JobPreparationService.getTopics(subjectId!, 1);
      return topics.results.find(topic => topic.uid === topicId);
    },
    enabled: !!topicId && !!subjectId,
  });

  // Initialize timer when exam starts
  useEffect(() => {
    if (examStarted && questionsData && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setExamFinished(true);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, questionsData, timeLeft]);

  const startExam = () => {
    if (questionsData) {
      const totalTime = questionsData.results.reduce((sum, q) => sum + q.time_limit_seconds, 0);
      setTimeLeft(totalTime);
      setExamStarted(true);
    }
  };

  const handleOptionSelect = (questionId: string, optionLabel: string) => {
    if (examFinished) return;

    setExamState(prev => ({
      ...prev,
      [questionId]: {
        selectedOption: optionLabel,
        isAnswered: true,
      }
    }));
  };

  const submitExam = async () => {
    if (!questionsData) return;

    const examResults = [];
    
    for (const question of questionsData.results) {
      const userAnswer = examState[question.uid];
      if (userAnswer?.selectedOption) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/practice/check-answer/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question_id: question.uid,
              selected_option_label: userAnswer.selectedOption,
            }),
          });
          
          if (response.ok) {
            const result = await response.json();
            examResults.push({
              question,
              userAnswer: userAnswer.selectedOption,
              result,
            });
          }
        } catch (error) {
          console.error('Error checking answer:', error);
        }
      }
    }
    
    setResults(examResults);
    setExamFinished(true);
  };

  const handleBack = () => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}`);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (questionsData?.results.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScore = () => {
    const correct = results.filter(r => r.result.is_correct).length;
    const total = results.length;
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center py-8">Loading exam...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (examFinished) {
    const score = getScore();
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Exam Completed!</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="text-6xl font-bold text-blue-600 mb-4">{score.percentage}%</div>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                    You scored {score.correct} out of {score.total} questions correctly
                  </p>
                  <Progress value={score.percentage} className="w-full h-4 mb-4" />
                </div>
              </div>

              <div className="space-y-6">
                {results.map((item, index) => (
                  <Card key={item.question.uid}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Question #{index + 1}</span>
                        <Badge variant={item.result.is_correct ? "default" : "destructive"}>
                          {item.result.is_correct ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-lg">{item.question.question_text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {item.question.options.map((option: any) => {
                          let optionClassName = 'p-3 border rounded-lg ';
                          
                          if (option.option_label === item.userAnswer) {
                            if (item.result.is_correct) {
                              optionClassName += 'bg-green-50 border-green-300 dark:bg-green-900/20';
                            } else {
                              optionClassName += 'bg-red-50 border-red-300 dark:bg-red-900/20';
                            }
                          } else if (option.option_label === item.result.correct_option_label) {
                            optionClassName += 'bg-green-50 border-green-300 dark:bg-green-900/20';
                          } else {
                            optionClassName += 'bg-gray-50 dark:bg-gray-800';
                          }

                          return (
                            <div key={option.uid} className={optionClassName}>
                              <div className="flex items-center justify-between">
                                <span>
                                  <span className="font-medium">{option.option_label}</span> {option.option_text}
                                </span>
                                {option.option_label === item.result.correct_option_label && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {option.option_label === item.userAnswer && !item.result.is_correct && (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {item.result.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-blue-700 dark:text-blue-300">{item.result.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button onClick={handleBack} className="mr-4">
                  Back to Topics
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retake Exam
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!examStarted) {
    const totalQuestions = questionsData?.results.length || 0;
    const totalTime = questionsData?.results.reduce((sum, q) => sum + q.time_limit_seconds, 0) || 0;
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <Button variant="ghost" onClick={handleBack} className="mb-6">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                {topicData?.topic_name} - Exam Mode
              </h1>
              
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Questions:</span>
                      <span className="text-2xl font-bold text-blue-600">{totalQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Time:</span>
                      <span className="text-2xl font-bold text-green-600">{formatTime(totalTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-4 text-left bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mb-8">
                <h3 className="font-bold text-lg">Exam Instructions:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>You have a limited time to complete the exam</li>
                  <li>Once you start, the timer will begin counting down</li>
                  <li>You can navigate between questions using the navigation buttons</li>
                  <li>Your answers are saved automatically</li>
                  <li>Submit the exam before time runs out</li>
                  <li>Results will be shown immediately after submission</li>
                </ul>
              </div>
              
              <Button onClick={startExam} size="lg" className="text-lg px-8 py-4">
                Start Exam
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questionsData?.results[currentQuestionIndex];
  const progress = questionsData ? ((currentQuestionIndex + 1) / questionsData.results.length) * 100 : 0;
  const answeredCount = Object.keys(examState).filter(key => examState[key].isAnswered).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Exam Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {questionsData?.results.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Answered: {answeredCount}/{questionsData?.results.length}
                </div>
              </div>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          {currentQuestion && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question #{currentQuestion.question_number}</span>
                  <Badge variant="outline">
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-lg">{currentQuestion.question_text}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => {
                    const isSelected = examState[currentQuestion.uid]?.selectedOption === option.option_label;
                    
                    return (
                      <div
                        key={option.uid}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => handleOptionSelect(currentQuestion.uid, option.option_label)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                          </div>
                          <span>
                            <span className="font-medium">{option.option_label}</span> {option.option_text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-4">
              <Button onClick={submitExam} variant="destructive">
                Submit Exam
              </Button>
            </div>
            
            <Button 
              onClick={nextQuestion}
              disabled={currentQuestionIndex === (questionsData?.results.length || 0) - 1}
            >
              Next
              <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamModePage;
