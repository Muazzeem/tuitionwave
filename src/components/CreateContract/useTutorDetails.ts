
import { Tutor } from '@/types/tutor';
import { useState, useEffect, useCallback } from 'react';

interface ActiveDay {
  id: number;
  day: string;
}


export const useTutorDetails = (tutorId: string, isDrawerOpen: boolean) => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [activeDayMapping, setActiveDayMapping] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTutorDetails = useCallback(async () => {
    setLoading(true);
    if (tutorId) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/${tutorId}`);
        const data = await response.json();
        
        setTutor(data);

        const daysList: string[] = [];
        const daysMap: Record<string, number> = {};

        data?.active_days?.forEach((dayInfo: ActiveDay) => {
          daysList.push(dayInfo.day.slice(0, 3)); // Shorten day names to three letters
          daysMap[dayInfo.day.slice(0, 3)] = dayInfo.id;
        });

        setActiveDays(daysList);
        setActiveDayMapping(daysMap);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [tutorId]);

  useEffect(() => {
    if (isDrawerOpen && tutorId) {
      fetchTutorDetails();
    }
  }, [isDrawerOpen, tutorId, fetchTutorDetails]);

  return {
    tutor,
    activeDays,
    activeDayMapping,
    loading
  };
};
