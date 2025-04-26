
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from './ui/card';
import { Star, Calendar } from 'lucide-react';
import { Tutor } from '@/types/tutor';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const TutorDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>('5000');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    
    if (id) {
      fetch(`http://127.0.0.1:8000/api/tutors/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      })
        .then((response) => response.json())
        .then((data) => setTutor(data))
        .catch((error) => console.error('Error fetching tutor details:', error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !tutor) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={tutor.profile_picture_url || "/lovable-uploads/cf92a62d-174b-4e20-bb37-7b5e32ca556c.png"}
            alt="Tutor Profile"
            className="w-full h-[500px] object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{tutor.description}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 text-black">4.7</span>
              </div>
              <span className="text-gray-500">(54 reviews)</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Education: {tutor.degree.name} in {tutor.department.name}
            </h2>
            <p className="text-gray-600">
              From {tutor.institute.name}
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Available {tutor.days_per_week} days per week</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3 text-gray-900">Select Days</h3>
              <ToggleGroup 
                type="multiple"
                value={selectedDays}
                onValueChange={setSelectedDays}
                className="flex flex-wrap gap-2"
              >
                {tutor.active_days.map((dayInfo) => (
                  <ToggleGroupItem
                    key={dayInfo.id}
                    value={dayInfo.day}
                    aria-label={dayInfo.day}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      "border-2 border-gray-200 hover:bg-blue-50",
                      "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600"
                    )}
                  >
                    {dayInfo.day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Select Subject</h3>
              <ToggleGroup
                type="multiple"
                value={selectedSubjects}
                onValueChange={setSelectedSubjects}
                className="flex flex-wrap gap-2"
              >
                {tutor.subjects.map((subjectInfo) => (
                  <ToggleGroupItem
                    key={subjectInfo.id}
                    value={subjectInfo.subject}
                    aria-label={subjectInfo.subject}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      "border-2 border-gray-200 hover:bg-blue-50",
                      "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600"
                    )}
                  >
                    {subjectInfo.subject}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Monthly Fee Range</h3>
              <p className="text-xl font-semibold text-blue-600">
                {tutor.expected_salary.display_range}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">I want to Pay</h3>
              <Input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="w-full"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Custom Notes</h3>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full min-h-[120px]"
                placeholder="Write any custom message or special requirements"
              />
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              onClick={() => {
                console.log({
                  amount: selectedAmount,
                  message: customMessage,
                  selectedDays,
                  selectedSubjects
                });
              }}
            >
              Make Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;
