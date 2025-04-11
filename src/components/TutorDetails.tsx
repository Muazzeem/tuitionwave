import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const TutorDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();  // Get tutor ID from the URL
  const [tutor, setTutor] = useState<any>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['English']);

  // Fetch tutor details by ID from API
  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`http://127.0.0.1:8000/api/tutors/${id}`)
        .then((response) => response.json())
        .then((data) => setTutor(data))
        .catch((error) => console.error('Error fetching tutor details:', error));
      setLoading(false);
    }
  }, [id]);  // Re-run this effect when the 'id' changes

  // Toggle selected days
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Toggle selected subjects
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Show loading or display tutor details
  if (!tutor) {
    return <div>
      <Skeleton className="h-48 w-full mb-3" />
    </div>;  // Display loading state while data is being fetched
  }

  return (
    <div className="container mx-auto px-4 py-12">

      <div className="">
        {loading ? (
          // Loading skeletons
          [...Array(1)].map((_, index) => (
            <Card key={index}>
              <div className="p-3">
                <Skeleton className="h-48 w-full mb-3" />
              </div>
            </Card>
          ))
        ) : tutor ? (
          // Display tutors

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <img
                  src={tutor.profile_picture || "/default-image.png"}  // Use fetched image or default
                  alt={tutor.username}
                  className="w-full h-full rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-2">{tutor.user.first_name} {tutor.user.last_name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 star-filled" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">5.0 (10)</span>
                </div>

                <h2 className="text-xl font-semibold mb-3">Tuition From: ৳{tutor.teaching_rate.toLocaleString()}</h2>

                <p className="text-gray-600 mb-6">{tutor.description}</p>

                <div className="mb-6">
                  <h3 className="text-gray-500 text-sm mb-2">Select Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.active_days.map((dayObj: { day: string }, index: number) => (
                      <button
                        key={index}
                        onClick={() => toggleDay(dayObj.day)}
                        className={`px-4 py-2 rounded-md text-sm ${selectedDays.includes(dayObj.day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {dayObj.day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-500 text-sm mb-2">Select Subject</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subjectObj: { subject: string }, index: number) => (
                      <button
                        key={index}
                        onClick={() => toggleDay(subjectObj.subject)}
                        className={`px-4 py-2 rounded-md text-sm ${selectedDays.includes(subjectObj.subject)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {subjectObj.subject}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-500 text-sm mb-2">I want to Pay</h3>
                    <Input type="text" placeholder={tutor.teaching_rate.toLocaleString()} className="w-full" />
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm mb-2">Custom Notes</h3>
                    <Textarea placeholder="Write any custom message" className="w-full" />
                  </div>

                  <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg">
                    Make Request
                  </Button>
                </div>
              </div>
            </div>
          </div>

        ) : (
          // No tutors found
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No tutors found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDetails;
