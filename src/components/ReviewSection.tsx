
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReviewItem = ({ name, location, content }: { name: string; location: string; content: string }) => (
  <div className="py-6 border-b">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="w-5 h-5 star-filled" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
    <p className="my-4 text-gray-700">{content}</p>
    <div className="flex items-center">
      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">
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
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold">4.7 Rating</h3>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-5 h-5 star-filled" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    </div>
    <p className="text-sm text-gray-500 mb-6">Based on 54+ Reviews</p>
    
    {[5, 4, 3, 2, 1].map((rating) => (
      <div key={rating} className="flex items-center mb-2">
        <span className="w-3 text-gray-600">{rating}</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
          <div 
            className="star-rating-bar" 
            style={{ 
              width: rating === 5 ? '90%' : 
                     rating === 4 ? '7%' : 
                     rating === 3 ? '2%' : 
                     rating === 2 ? '0%' : '1%' 
            }}
          ></div>
        </div>
        <span className="w-6 text-right text-xs text-gray-600">
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
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="description">
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
              />
              <ReviewItem 
                name="Abdur Rahman" 
                location="Dhaka, Bangladesh" 
                content="Shakib has been an incredible tutor for my son. He's patient, understanding, and has a unique ability to explain complex concepts in a way that's easy to understand. I highly recommend him to any parent looking for a dedicated and reliable tutor!"
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <RatingsSummary />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
