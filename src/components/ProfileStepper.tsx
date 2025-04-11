
import React from 'react';

export interface Step {
  id: number;
  title: string;
}

interface ProfileStepperProps {
  steps: Step[];
  currentStep: number;
}

export const ProfileStepper: React.FC<ProfileStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                isActive ? 'bg-blue-600' : 
                isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {step.id < currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="mt-2 text-sm font-medium">{step.title}</span>
            </div>
          );
        })}
      </div>
      
      {/* Connecting lines */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
      <div 
        className="absolute top-5 left-0 h-0.5 bg-blue-600 -z-5 transition-all duration-300"
        style={{ 
          width: `${(currentStep - 1) * 50}%`,
        }}
      />
    </div>
  );
};
