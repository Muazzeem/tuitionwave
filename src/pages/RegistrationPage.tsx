
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step } from '@/components/ProfileStepper';
import RegistrationForm from '@/components/Registration/RegistrationForm';
import OTPVerification from '@/components/Registration/OTPVerification';
import RegistrationSuccess from '@/components/Registration/RegistrationSuccess';
import { RegistrationData } from '@/types/common';
import { useToast } from '@/components/ui/use-toast';

const steps: Step[] = [
  { id: 1, title: 'Create Account' },
  { id: 2, title: 'Verify Email' },
  { id: 3, title: 'Upload NID' },
  { id: 4, title: 'Success' },
];

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    phone: '',
    password1: '',
    password2: '',
    user_type: 'GUARDIAN',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setRegistrationData(formData);
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to register.",
        variant: "destructive",
      });
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

      setCurrentStep(3); // Move to success step
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to verify OTP.",
        variant: "destructive",
      });
    }
  };

  const handleNIDUpload = async (nidFile: File) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('email', registrationData.email);
      formData.append('nid_document', nidFile);

      const response = await fetch('http://127.0.0.1:8000/auth/upload-nid/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'NID upload failed');
      }

      // Show success message and move to success step
      setCurrentStep(4);
    } catch (error: any) {

    }
  };

  const handleLoginRedirect = () => {
    // Redirect to login page or dashboard based on the user type
    if (registrationData.user_type === 'TEACHER') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/guardian/dashboard');
    }
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
        <div className="w-full max-w-2xl p-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-gray-900">
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
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
