
// src/components/AuthGuard.tsx
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallbackPath?: string;
  allowedRoles?: string[];
}

const AuthGuard = ({ 
  children, 
  fallbackPath = '/login',
  allowedRoles
}: AuthGuardProps) => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        // Redirect to login if not authenticated
        navigate(fallbackPath, { replace: true });
      } else if (allowedRoles && !allowedRoles.includes(userProfile.user_type)) {
        // Redirect to unauthorized if authenticated but not authorized
        navigate('/unauthorized', { replace: true });
      } else {
        setIsChecking(false);
      }
    }
  }, [userProfile, loading, navigate, fallbackPath, allowedRoles]);

  if (loading || isChecking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
