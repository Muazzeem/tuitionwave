import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Step, ProfileStepper } from '@/components/ProfileStepper';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfileCompletionAlert from '@/components/ProfileCompletionAlert';
import { ProfileFormData } from '@/types/tutor';
import EducationForm from '@/components/EducationForm';
import TuitionForm from '@/components/TuitionForm';

const ProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProfileFormData>({
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
    }
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

  const updateFormData = (partialData: Partial<ProfileFormData>) => {
    setFormData({ ...formData, ...partialData });
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <DashboardHeader userName="Tutor" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <ProfileCompletionAlert />

        <div className="flex justify-center w-full">
          <div className="col-6 w-1/2">
            <div className="bg-white p-8 rounded-lg border">
              <ProfileStepper
                steps={steps}
                currentStep={currentStep}
                onNext={handleNext}
                onPrev={handleBack}
              />

              <div className="mt-8 mb-10">
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
    </div>
  );
};

export default ProfilePage;
