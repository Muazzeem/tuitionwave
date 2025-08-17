import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { setAuthTokens } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import GoogleLoginButton from '@/components/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProfile, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
  const from = location.state?.from?.pathname || lastVisitedUrl || '/dashboard';

  useEffect(() => {
    if (userProfile) {
      navigate(from, { replace: true });
      localStorage.removeItem("lastVisitedUrl");
    }
  }, [userProfile, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setAuthTokens(data);
      await fetchProfile();

      toast({
        title: "Login Success",
        description: "Successfully logged in!",
      });

      navigate(from, { replace: true });
      localStorage.removeItem("lastVisitedUrl");
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

  const handleGoogleLoginSuccess = async (userData: any) => {
    try {
      setAuthTokens(userData);
      await fetchProfile();

      toast({
        title: "Google Login Success",
        description: "Successfully logged in with Google!",
      });

      navigate(from, { replace: true });
      localStorage.removeItem("lastVisitedUrl");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Failed to complete Google login process.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full dark:bg-gray-900">
      {/* Left section with image */}
      <div className="hidden md:flex md:w-1/2 bg-gray-600 relative">
        <img
          src="/lovable-uploads/56c05a63-4266-4a9d-ad96-7c9d83120840.png"
          alt="Mother and child studying"
          className="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-6 left-6">
          <Link to="/">
            <h1 className="text-2xl font-bold text-white">Tuition Wave</h1>
          </Link>
        </div>

        <div className="absolute bottom-20 left-10 text-white">
          <h2 className="text-3xl font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm">Manage Your Perfect Tuition Effortlessly</p>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-background">
            <h2 className="text-2xl font-bold mb-2">Log in to Dashboard</h2>
            <p className="text-gray-500 mb-6 dark:text-gray-400">
              Welcome! Please enter your credentials or continue with Google.
            </p>

            {/* Google Login Button */}
            <div className="mb-6">
              <GoogleLoginButton
                onSuccess={handleGoogleLoginSuccess}
                disabled={loading}
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-background dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
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
                      className="w-full dark:bg-gray-900"
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
                      className="w-full pr-10 dark:bg-gray-900"
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
                  className="w-full min-h-[55px] bg-primary hover:bg-primary-700 mt-2 dark:text-white shadow-xl text-md"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>

                <div className="text-center mt-4 text-md">
                  Don't have an account?{" "}
                  <Link to="/auth/registration" className="text-primary hover:underline font-medium">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
