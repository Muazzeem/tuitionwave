import React from 'react';
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export interface Step {
  id: number;
  title: string;
}

interface ProfileStepperProps {
  steps: Step[];
  currentStep: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ProfileStepper: React.FC<ProfileStepperProps> = ({ steps, currentStep, onNext, onPrev }) => {
  const isFirstStep = currentStep === steps[0]?.id;
  const isLastStep = currentStep === steps[steps.length - 1]?.id;
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white 
                  ${isActive ? 'bg-blue-600' : 
                    isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{String(step.id).padStart(2, '0')}</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium hidden lg:block md:block ${isActive ? 'text-blue-600' : isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${isFirstStep 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={isLastStep}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${isLastStep 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`}
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Demo component to show the stepper in action
const StepperDemo = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  
  const steps: Step[] = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Contact Details' },
    { id: 3, title: 'Preferences' },
    { id: 4, title: 'Review' }
  ];
  
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
  
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      <h2 className="text-2xl font-bold text-center mb-8">Profile Setup</h2>
      <ProfileStepper 
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">
          Step {currentStep}: {steps.find(s => s.id === currentStep)?.title}
        </h3>
        <p className="text-gray-600">
          Content for step {currentStep} would go here...
        </p>
      </div>
    </div>
  );
};

export default StepperDemo;