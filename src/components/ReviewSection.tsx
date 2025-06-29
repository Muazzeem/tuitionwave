import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';

import { FeedbackItem, FeedbackResponse, ReviewItemProps } from '@/types/common';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const ReviewItem = ({ name, comment, rating, date }: ReviewItemProps) => (
  <Card className="mb-6 border-t shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
    <CardContent className="p-1">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
            {name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    className={index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
          {date}
        </span>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          "{comment}"
        </p>
      </div>
    </CardContent>
    <hr className='mt-2' />
  </Card>
);

const RatingsSummary = ({ feedbacks }: { feedbacks: FeedbackItem[] }) => {
  // Calculate average rating
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, item) => acc + item.avg_ratting, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  // Count ratings by star level
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
    const count = feedbacks.filter(item => 
      Math.floor(item.avg_ratting) === rating
    ).length;
    
    const percentage = feedbacks.length > 0 
      ? (count / feedbacks.length) * 100 
      : 0;
    
    return { rating, count, percentage };
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { text: 'Excellent', variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' };
    if (rating >= 4.0) return { text: 'Very Good', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (rating >= 3.0) return { text: 'Good', variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'Needs Improvement', variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' };
  };

  const badgeInfo = getRatingBadge(parseFloat(avgRating));

  return (
    <Card className="shadow-sm border-0 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {avgRating}
              </h3>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={24}
                className={index < Math.round(parseFloat(avgRating)) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>

          <Badge className={`mb-4 ${badgeInfo.className}`}>
            {badgeInfo.text}
          </Badge>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users size={16} />
            <span>{feedbacks.length} 
              {feedbacks.length === 1 ? ' Review' : ' Reviews'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 dark:bg-gray-800">
        <div className="space-y-3">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
              </div>
              
              <div className="flex-1">
                <Progress
                  className="h-2.5 bg-gray-200 dark:bg-gray-700"
                  value={percentage}
                />
              </div>
              
              <span className="w-8 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                {count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ReviewSectionProps {
  id: string;
  condition?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ id, condition }) => {
  const [tutorData, setTutorData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${BASE_URL}/api/tutors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch tutor data');
        const data = await response.json();
        setTutorData(data);
      } catch (err) {
        setError('Error fetching tutor data');
        console.error('Error fetching tutor data:', err);
      }
    };

    const fetchFeedbacks = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`${BASE_URL}/api/feedbacks/?tutor_id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch feedbacks');
        const data: FeedbackResponse = await response.json();
        setFeedbacks(data.results);
      } catch (err) {
        setError('Error fetching feedbacks');
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTutorData();
    fetchFeedbacks();
  }, [id, BASE_URL]);

  if (loading) {
    return (
      <div className="container mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="lg:col-span-2 animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 dark:text-red-400 text-lg font-medium">
              {error}
            </div>
            <p className="text-red-500 dark:text-red-300 mt-2">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2 ">
        {/* Ratings Summary - Left Column */}
        {(condition === "True") && (
          <div className="lg:col-span-1">
            <RatingsSummary feedbacks={feedbacks} />
          </div>
        )}

        <div className={`lg:col-span-${condition === "True" ? 2 : 3}`}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-0">
              <Tabs defaultValue="description" className="w-full">
                <div className="border-b bg-gray-50 dark:bg-gray-800/50 px-6 py-2">
                  <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="description"
                      className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        Reviews ({feedbacks.length})
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="description" className="p-6 mt-0 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {tutorData?.description || "No description available."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-3 mt-0 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-lg">
                  {feedbacks.length > 0 ? (
                    <div className="space-y-0">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          What Parents Say
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {feedbacks.length} Review{feedbacks.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto pr-2 space-y-0">
                        {feedbacks.map(feedback => (
                          <ReviewItem
                            key={feedback.uid}
                            name={`${feedback.student.first_name} ${feedback.student.last_name}`}
                            comment={feedback.comment}
                            rating={feedback.avg_ratting}
                            date={formatDate(feedback.created_at)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <MessageCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Be the first to share your experience with this tutor.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;