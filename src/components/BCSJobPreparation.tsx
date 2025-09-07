
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import JobPreparationService from '@/services/JobPreparationService';
import SearchSection from './SearchSection';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/types/jobPreparation';

const BCSJobPreparation: React.FC = () => {
  const navigate = useNavigate();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const { data: categoriesData, isLoading: categoriesLoading, error } = useQuery({
    queryKey: ['categories', 1],
    queryFn: () => JobPreparationService.getCategories(1),
  });

  useEffect(() => {
    if (categoriesData?.results) {
      setFilteredCategories(categoriesData.results);
      console.log("Filtered categories:", filteredCategories);
    }
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-800 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <img
          src="/lovable-uploads/cover-image.jpg"
          alt="Tutor helping student"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Exam • Preparation • Succeed
          </h2>
          <p className="text-xl text-gray-200">
            Bangladesh's hub for learning & earning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Become a Tutor Card */}
          <Card className="bg-background border border-gray-700 text-white backdrop-blur-md shadow-xl rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold mb-2">
                Become a Tutor — <span className="text-2xl">টিউটর হয়ে উঠুন</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
                <div className="flex flex-col">
                  <div className="bbg-background border border-gray-700 rounded-xl p-4">
                    <div className="text-4xl font-bold mb-2">5,000+ Tutors</div>
                    <p className="text-gray-300 text-sm">From top universities</p>
                  </div>

                  <div className="flex gap-3 justify-center mt-4 mb-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center"
                      >
                        <div className="w-6 h-6 bg-slate-600 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="space-y-4 text-left ml-2">
                    <p className="text-gray-300">
                      Don't be unemployed — <span className="text-sm">নিজেকে সাহায্য করুন।</span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      বাবা-মার কাছে থেকে টাকা না নিয়ে নিজের আয়ে গর্বাশীল হন।
                    </p>
                    <p className="text-gray-300">
                      Girls' safety first:{" "}
                      <span className="text-sm">
                        রাতে বাইরে না গেলেও Online Tuition is perfect & time-saving.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-3 rounded-xl text-lg mt-auto"
                onClick={() => navigate('/auth/registration')}
              >
                Start Teaching
              </Button>
            </CardContent>
          </Card>

          {/* Job Preparation Card */}
          <Card className="bg-background border border-gray-700 text-white backdrop-blur-md shadow-xl rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold mb-0">
                Job Preparation — <span className="text-2xl">চাকরির প্রস্তুতি</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
                <div className="flex flex-col">
                  <div className="bbg-background border border-gray-700 rounded-xl p-4">
                    <div className="text-4xl font-bold mb-2">
                      130,000+
                    </div>
                    <p className="text-gray-300 text-sm">Questions</p>
                  </div>

                  <div className="flex justify-center mt-4 mb-4">
                    <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2">
                      {filteredCategories.map((category, index) => {
                        return (
                          <Badge
                            key={category.uid}
                            className={`${index === 0 ? "bg-cyan-500 hover:bg-cyan-500" : "bg-slate-700 hover:bg-cyan-500"
                              } text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-600 cursor-pointer`}
                            onClick={() => navigate(`job-preparation/category/${category.uid}`)}
                          >
                            {category.category_name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4 text-left ml-2">
                    <p className="text-gray-300">
                      Daily Model Test — প্রতিদিন প্র্যাকটিস।
                    </p>
                    <p className="text-gray-300 text-sm">
                      Self Model Test: subject/topic অনুযায়ী নিজের মতো তৈরি করুন।
                    </p>
                    <p className="text-gray-300">
                      Free Exams & Detailed Explanations.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-3 rounded-xl text-lg mt-auto"
                onClick={() => navigate('job-preparation/questions')}
              >
                Start Preparation
              </Button>
            </CardContent>
          </Card>
        </div>
        <SearchSection />
      </div>
    </div>
  );
};

export default BCSJobPreparation;
