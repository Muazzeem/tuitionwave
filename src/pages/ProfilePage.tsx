
import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Step, ProfileStepper } from '@/components/ProfileStepper';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import { ProfileFormData } from '@/types/tutor';
import EducationForm from '@/components/EducationForm';
import TuitionForm from '@/components/TuitionForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfileCompletionAlert, { ProfileCompletionAlertRef } from '@/components/ProfileCompletionAlert';


const ProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const profileRef = useRef<ProfileCompletionAlertRef>(null);
  
  const [formData, setFormData] = useState<ProfileFormData & {
    daysPerWeek: string;
    teachingType: string;
    minSalary: string;
    maxSalary: string;
    minHourlyCharge: string;
    maxHourlyCharge: string;
    subjects: string[];
    activeDays: string[];
    preferredDistricts: string[];
    preferredAreas: string[];
    preferredTime: string;
    description: string;
  }>({
    full_name: '',
    address: '',
    gender: '',
    birthDate: undefined,
    linkedinProfile: '',
    profilePicture: null,
    degree: '',
    institute: '',
    department: '',
    currentStatus: '',
    cvDocument: null,
    education: [],
    daysPerWeek: '',
    teachingType: '',
    minSalary: '',
    maxSalary: '',
    minHourlyCharge: '',
    maxHourlyCharge: '',
    subjects: [],
    activeDays: [],
    preferredDistricts: [],
    preferredAreas: [],
    tuitionDetails: {
      teachingRate: 0,
      teachingType: 'ONLINE',
      subjects: []
    },
    preferredTime: '',
    description: ''
  });

  const steps: Step[] = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Education' },
    { id: 3, title: 'Tuition' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (partialData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...partialData });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <DashboardHeader userName="Tutor" />

       <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="lg:text-3xl sm:text-2xl font-bold">Edit Profile</h1>
          </div>

          <div className="mb-4 sm:mb-6">
            <ProfileCompletionAlert ref={profileRef} />
          </div> 

          <div className="flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <div className="bg-background p-4 sm:p-6 lg:p-8 rounded-lg">
                <div className="mb-6 sm:mb-8">
                  <ProfileStepper
                    steps={steps}
                    currentStep={currentStep}
                    onNext={handleNext}
                    onPrev={handleBack}
                  />
                </div>

                <div className="mt-6 sm:mt-8 mb-6 sm:mb-10">
                  {currentStep === 1 && (
                    <PersonalInfoForm
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 2 && (
                    <EducationForm
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={handleNext}
                      onPrev={handleBack}
                    />
                  )}

                  {currentStep === 3 && (
                    <TuitionForm
                      formData={formData}
                      updateFormData={updateFormData}
                      onNext={handleNext}
                      onPrev={handleBack}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfilePage;
