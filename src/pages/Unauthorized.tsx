
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
    const navigate = useNavigate();
    const { userProfile, clearProfile } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        if (userProfile?.user_type === 'TEACHER') {
            navigate('/teacher/dashboard');
        } else if (userProfile?.user_type === 'GUARDIAN') {
            navigate('/guardian/dashboard');
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        clearProfile();
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="text-red-500 flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. This area may be restricted to specific user roles.
                    </p>
                </div>
                
                <div className="space-y-2">
                    <Button 
                        variant="outline" 
                        className="w-full mb-2"
                        onClick={handleGoHome}
                    >
                        Go to Dashboard
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full mb-2"
                        onClick={handleGoBack}
                    >
                        Go Back
                    </Button>
                    <Button 
                        variant="default"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
