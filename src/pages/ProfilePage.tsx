
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Step, ProfileStepper } from '@/components/ProfileStepper';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import { ProfileFormData } from '@/types/tutor';

const ProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    address: '',
    gender: '',
    birthDate: undefined,
    linkedinProfile: '',
    profilePicture: null,
    education: [],
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
        
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <div className="flex items-center mb-1">
            <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 6a1 1 0 011 1v5a1 1 0 11-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <h3 className="font-bold">Complete Your Tutor Profile & Unlock Your Potential!</h3>
          </div>
          <p>Showcase your expertise, attract more students, and stand out by finishing your profile setup! To Update profile <span className="text-red-700 cursor-pointer font-medium hover:underline">click here</span></p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <ProfileStepper steps={steps} currentStep={currentStep} />
          
          <div className="mt-8">
            {currentStep === 1 && (
              <PersonalInfoForm 
                formData={formData} 
                updateFormData={updateFormData} 
                onNext={handleNext} 
              />
            )}
            
            {currentStep === 2 && (
              <div className="flex justify-between mt-8">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={handleBack}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="flex justify-between mt-8">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
