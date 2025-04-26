
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { MapPin, Book, Calendar, DollarSign, GraduationCap, Building, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tutor } from '@/types/tutor';

const TutorDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!tutor) {
    return <div className="container mx-auto px-4 py-8">Failed to load tutor details.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6">
            <div className="mb-6">
              <img
                src={tutor.profile_picture_url || "/lovable-uploads/ced7cd19-6baa-4f95-a194-cd4c9c7c3f0c.png"}
                alt="Tutor Profile"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{tutor.description}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{tutor.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{tutor.gender_display}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="font-medium">{tutor.degree.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Institute</p>
                  <p className="font-medium">{tutor.institute.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{tutor.department.name}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1">Schedule & Fees</TabsTrigger>
              <TabsTrigger value="subjects" className="flex-1">Subjects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Preferred Locations</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Districts:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.preferred_districts.map((district) => (
                        <Badge key={district.id} variant="secondary">
                          {district.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.preferred_areas.map((area) => (
                        <Badge key={area.id} variant="secondary">
                          {area.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.active_days.map((day) => (
                        <Badge key={day.id} variant="outline">
                          {day.day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Days per Week</p>
                        <p className="font-medium">{tutor.days_per_week} days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Expected Monthly Salary</p>
                        <p className="font-medium">{tutor.expected_salary.display_range}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Teaching Type</h3>
                    <Badge>{tutor.teaching_type_display}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Hourly Rate</h3>
                    <p className="text-xl font-semibold text-blue-600">
                      {tutor.expected_hourly_charge.display_range}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge 
                      key={subject.id}
                      variant={selectedSubjects.includes(subject.subject) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedSubjects.includes(subject.subject)) {
                          setSelectedSubjects(selectedSubjects.filter(s => s !== subject.subject));
                        } else {
                          setSelectedSubjects([...selectedSubjects, subject.subject]);
                        }
                      }}
                    >
                      {subject.subject}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Request Tuition</h3>
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Enter your offer amount"
                    className="w-full"
                  />
                  <Textarea
                    placeholder="Write any special requirements or message for the tutor"
                    className="w-full"
                  />
                  <Button className="w-full">Send Request</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;
