
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const TutorDetails: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['English']);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src="/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png"
            alt="Tutor Mamun"
            className="w-full h-full rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">Muazzem Hossain</h1>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 star-filled" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">4.7 (54)</span>
          </div>

          <h2 className="text-xl font-semibold mb-3">Tuition From : ৳5000.00</h2>

          <p className="text-gray-600 mb-6">
            John Doe is a passionate tutor specializing in Mathematics and Science. With over 5 years of teaching experience, John holds a Master's degree in Physics from XYZ University.
          </p>

          <div className="mb-6">
            <h3 className="text-gray-500 text-sm mb-2">Select Days</h3>
            <div className="flex flex-wrap gap-2">
              {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-md text-sm ${selectedDays.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-500 text-sm mb-2">Select Subject</h3>
            <div className="flex flex-wrap gap-2">
              {['Bangla', 'English', 'Maths', 'Science', 'History', 'Geography'].map((subject, index) => (
                <button
                  key={index}
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-md text-sm ${selectedSubjects.includes(subject)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-gray-500 text-sm mb-2">I want to Pay</h3>
              <Input type="text" placeholder="5000.00" className="w-full" />
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
  );
};

export default TutorDetails;
