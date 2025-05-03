
import React from 'react';
import { Button } from '@/components/ui/button';

interface RegistrationSuccessProps {
  onLogin: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ onLogin }) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-32 h-32 mb-6">
        <img 
          src="/lovable-uploads/0e4fc338-9726-437e-8116-c2b55dddc5f8.png" 
          alt="Success" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">All Done!</h2>
      <p className="text-gray-600 mb-8">
        Your account has been created successfully!
      </p>
      
      <Button 
        className="w-full min-h-[55px] bg-blue-600 hover:bg-blue-700 mb-4"
        onClick={onLogin}
      >
        Login Now
      </Button>
    </div>
  );
};

export default RegistrationSuccess;
