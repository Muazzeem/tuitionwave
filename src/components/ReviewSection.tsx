
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from './ui/card';

interface ReviewItemProps {
  name: string;
  location: string;
  content: string;
  rating: number;
  date: string;
}

const ReviewItem = ({ name, location, content, rating, date }: ReviewItemProps) => (
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
        <span className="ml-1 text-sm text-gray-600">{rating}.0</span>
      </div>
      <span className="text-sm text-gray-500">{date}</span>
    </div>

    <p className="my-4 text-gray-700">{content}</p>

    <div className="flex items-center">
      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
        {name.charAt(0)}
      </div>
      <div className="ml-3">
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
  </div>
);

const RatingsSummary = () => (
  <div className="p-6 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-xl font-bold">4.7 Rating</h3>
      <Badge variant="outline" className="text-yellow-500 bg-yellow-50 border-yellow-200 px-2 py-1">
        Top Rated
      </Badge>
    </div>

    <div className="flex mb-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={20}
          className="text-yellow-500 fill-yellow-500"
        />
      ))}
    </div>

    <p className="text-sm text-gray-500 mb-6">Based on 54+ Reviews</p>

    {[5, 4, 3, 2, 1].map((rating) => (
      <div key={rating} className="flex items-center mb-3">
        <span className="w-3 text-gray-600 mr-2">{rating}</span>
        <Progress
          className="h-2 flex-1 bg-gray-200"
          value={rating === 5 ? 90 :
            rating === 4 ? 7 :
              rating === 3 ? 2 :
                rating === 2 ? 0 : 1}
        />
        <span className="w-8 text-right text-xs text-gray-600 ml-2">
          {rating === 5 ? '50' :
            rating === 4 ? '04' :
              rating === 3 ? '00' :
                rating === 2 ? '00' : '05'}
        </span>
      </div>
    ))}
  </div>
);

const ReviewSection: React.FC = () => {
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
                    Customer Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-6">
                  <p className="text-gray-700">
                    Detailed description of the tutor's services, methodology, and approach to teaching.
                  </p>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6">
                  <ReviewItem
                    name="Abdur Rahman"
                    location="Dhaka, Bangladesh"
                    content="Shakib has been an incredible tutor for my son. He's patient, understanding, and has a unique ability to explain complex concepts in a way that's easy to understand. I highly recommend him to any parent looking for a dedicated and reliable tutor!"
                    rating={5}
                    date="March 12, 2025"
                  />
                  <ReviewItem
                    name="Sarah Johnson"
                    location="Chittagong, Bangladesh"
                    content="I've been taking English lessons with Shakib for about 3 months now, and my improvement has been remarkable. He tailors his teaching style to match my learning pace, and always provides constructive feedback."
                    rating={4}
                    date="February 28, 2025"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:col-span-1">
              <RatingsSummary />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewSection;
