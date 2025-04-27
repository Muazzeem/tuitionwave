// src/components/AuthGuard.tsx
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- useNavigate instead of useRouter
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

const AuthGuard = ({ children, fallbackPath = '/login' }: AuthGuardProps) => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate(); // <-- useNavigate here
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        // Redirect to login if not authenticated
        navigate(fallbackPath, { replace: true }); // <-- use navigate
      } else {
        setIsChecking(false);
      }
    }
  }, [userProfile, loading, navigate, fallbackPath]);

  if (loading || isChecking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
