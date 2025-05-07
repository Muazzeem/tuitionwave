import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from './ui/card';
import { useParams } from 'react-router-dom';

import { FeedbackItem, FeedbackResponse, ReviewItemProps } from '@/types/common';


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ReviewItem = ({ name, comment, rating, date }: ReviewItemProps) => (
  <div className="py-6 border-b">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            className={index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
      <span className="text-sm text-gray-500">{date}</span>
    </div>

    <p className="my-4 text-gray-700">{comment}</p>

    <div className="flex items-center">
      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
        {name.charAt(0)}
      </div>
      <div className="ml-3">
        <h4 className="font-medium">{name}</h4>
      </div>
    </div>
  </div>
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

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">{avgRating} Rating</h3>
        {parseFloat(avgRating) >= 4.5 && (
          <Badge variant="outline" className="text-yellow-500 bg-yellow-50 border-yellow-200 px-2 py-1">
            Top Rated
          </Badge>
        )}
      </div>

      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < Math.round(parseFloat(avgRating)) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">Based on {feedbacks.length}+ Reviews</p>

      {ratingCounts.map(({ rating, count, percentage }) => (
        <div key={rating} className="flex items-center mb-3">
          <span className="w-3 text-gray-600 mr-2">{rating}</span>
          <Progress
            className="h-2 flex-1 bg-gray-200"
            value={percentage}
          />
          <span className="w-8 text-right text-xs text-gray-600 ml-2">
            {count.toString().padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
};

const ReviewSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutorData, setTutorData] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = 'http://127.0.0.1:8000';

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
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      <Card>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="reviews">
                <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent px-4 py-2"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent px-4 py-2"
                  >
                    Customer Reviews ({feedbacks.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6">
                  <p className="text-gray-700">
                    {tutorData?.description || "No description available."}
                  </p>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  {feedbacks.length > 0 ? (
                    feedbacks.map(feedback => (
                      <ReviewItem
                        key={feedback.uid}
                        name={`${feedback.student.first_name} ${feedback.student.last_name}`}
                        comment={feedback.comment}
                        rating={feedback.avg_ratting}
                        date={formatDate(feedback.created_at)}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 py-4">No reviews yet.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:col-span-1">
              <RatingsSummary feedbacks={feedbacks} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewSection;