
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from './ui/card';
import { Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tutor } from '@/types/tutor';

const TutorDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>('5000.00');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`http://127.0.0.1:8000/api/tutors/${id}`)
        .then((response) => response.json())
        .then((data) => setTutor(data))
        .catch((error) => console.error('Error fetching tutor details:', error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !tutor) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri'];

  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = () => {
    // Implement the request submission logic here
    console.log({
      amount: selectedAmount,
      message: customMessage,
      selectedDays,
      selectedSubjects
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={tutor.profile_picture_url || "/lovable-uploads/cf92a62d-174b-4e20-bb37-7b5e32ca556c.png"}
            alt="Tutor Profile"
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{tutor.description}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 text-black">{tutor.rating || 4.7}</span>
              </div>
              <span className="text-gray-500">({tutor.total_reviews || 54} reviews)</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Tuition From : {tutor.expected_salary.display_range}
            </h2>
            <p className="text-gray-600">
              {tutor.description || "John Doe is a passionate tutor specializing in Mathematics and Science. With over 5 years of teaching experience, John holds a Master's degree in Physics from XYZ University."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select Days</h3>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Badge
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleDaySelect(day)}
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Select Subject</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((subject) => (
                  <Badge
                    key={subject.id}
                    variant={selectedSubjects.includes(subject.subject) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSubjectSelect(subject.subject)}
                  >
                    {subject.subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">I want to Pay</h3>
              <Input
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="w-full"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Custom Notes</h3>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full"
                placeholder="Write any custom message"
                rows={4}
              />
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
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
