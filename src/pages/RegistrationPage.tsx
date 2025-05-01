
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileStepper, Step } from '@/components/ProfileStepper';
import RegistrationForm from '@/components/Registration/RegistrationForm';
import OTPVerification from '@/components/Registration/OTPVerification';
import RegistrationSuccess from '@/components/Registration/RegistrationSuccess';
import { RegistrationData } from '@/types/common';
import { toast } from 'sonner';

const steps: Step[] = [
  { id: 1, title: 'Create Account' },
  { id: 2, title: 'Verify Email' },
  { id: 3, title: 'Success' },
];

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    phone: '',
    password1: '',
    password2: '',
    user_type: 'GUARDIAN',
    first_name: '',
    last_name: ''
  });
  const navigate = useNavigate();

  const handleRegistrationSubmit = async (formData: RegistrationData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          password1: formData.password1,
          password2: formData.password2,
          user_type: formData.user_type,
          first_name: formData.first_name,
          last_name: formData.last_name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setRegistrationData(formData);
      setCurrentStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationData.email,
          otp: otp
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left section with image */}
      <div className="hidden md:flex md:w-1/2 bg-gray-600 relative">
        <img 
          src="/lovable-uploads/56c05a63-4266-4a9d-ad96-7c9d83120840.png" 
          alt="Mother and child studying" 
          className="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <h1 className="text-2xl font-bold text-white">Tuition Wave</h1>
        </div>
        
        {/* Welcome message */}
        <div className="absolute bottom-20 left-10 text-white">
          <h2 className="text-3xl font-bold mb-1">Welcome Back !</h2>
          <p className="text-sm">Manage Your Perfect Tuition Effortlessly</p>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl p-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            {currentStep === 1 && (
              <RegistrationForm 
                onSubmit={handleRegistrationSubmit} 
                initialData={registrationData}
              />
            )}
            {currentStep === 2 && (
              <OTPVerification 
                onVerify={handleOTPVerify} 
              />
            )}
            {currentStep === 3 && (
              <RegistrationSuccess 
                onLogin={handleLoginRedirect} 
              />
            )}
          </div>
          
          {/* Only show stepper for development purposes */}
          {/* <div className="mt-8">
            <ProfileStepper
              steps={steps}
              currentStep={currentStep}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
