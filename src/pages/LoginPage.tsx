
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { setAuthTokens } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchProfile, userProfile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<'tutor' | 'guardian'>('guardian');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleContinue = () => {
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setAuthTokens(data);
      
      // Fetch user profile after successful login
      await fetchProfile();
      
      toast({
        title: "Login Success",
        description: "Successfully logged in!",
      });
      
      // Navigate based on user type
      if (userType === 'tutor') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/guardian/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm">Manage Your Perfect Tuition Effortlessly</p>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {step === 1 ? (
            <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-gray-900">
              <h2 className="text-2xl font-bold text-center mb-6">Login as {userType === 'tutor' ? 'Tutor' : 'Guardian'}</h2>
              
              <RadioGroup 
                defaultValue="guardian" 
                className="flex justify-center gap-8 mb-8"
                value={userType}
                onValueChange={(value) => setUserType(value as 'tutor' | 'guardian')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tutor" id="tutor" />
                  <Label htmlFor="tutor">Tutor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="guardian" id="guardian" />
                  <Label htmlFor="guardian">Guardian</Label>
                </div>
              </RadioGroup>
              
              <Button 
                className="w-full min-h-[55px] bg-blue-600 hover:bg-blue-700 dark:text-white" 
                onClick={handleContinue}
                disabled={loading}
              >
                Next
              </Button>
              
              <div className="text-center mt-4 text-sm">
                Don't have an account? <Link to="/auth/registration" className="text-blue-600 hover:underline font-medium">Sign Up</Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-2">Log in to {userType === 'tutor' ? 'Tutor' : 'Guardian'} Panel</h2>
              <p className="text-gray-500 mb-6 dark:text-gray-400">Welcome! Please enter your email and password.</p>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full min-h-[55px] bg-blue-600 hover:bg-blue-700 mt-2 dark:text-white"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log in'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <button 
                      type="button" 
                      className="text-blue-600 hover:underline"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Back to user selection
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
