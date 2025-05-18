
import React from 'react';
import { Button } from "@/components/ui/button";
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
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{String(step.id).padStart(2, '0')}</span>
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div 
                  className={`absolute h-0.5 top-6 w-full -right-2/2 z-0 
                    ${index < currentStep - 1 ? 'bg-green-500' : 
                      index === currentStep - 1 && currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
