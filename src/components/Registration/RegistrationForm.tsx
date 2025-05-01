
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EyeIcon, EyeOffIcon, User, Mail, Phone } from 'lucide-react';
import { RegistrationData } from '@/types/common';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  initialData?: RegistrationData;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<RegistrationData>(initialData || {
    email: '',
    phone: '',
    password1: '',
    password2: '',
    user_type: 'GUARDIAN',
    first_name: '',
    last_name: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      user_type: value as 'TEACHER' | 'GUARDIAN'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.phone || !formData.password1 || !formData.password2) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (formData.password1 !== formData.password2) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const fullNameField = (
    <div>
      <Label htmlFor="fullName">Full Name</Label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <User className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id="fullName"
          type="text"
          placeholder="Full Name"
          className="pl-10"
          name="full_name"
          value={`${formData.first_name || ''} ${formData.last_name || ''}`.trim()}
          onChange={(e) => {
            const names = e.target.value.split(' ');
            setFormData(prev => ({
              ...prev,
              first_name: names[0] || '',
              last_name: names.slice(1).join(' ') || '',
            }));
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Signup</h2>
      <p className="text-gray-500 mb-6">Let's create your account!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {fullNameField}
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="pl-10"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                className="pl-10"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="password1">Password</Label>
            <div className="mt-1 relative">
              <Input
                id="password1"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                required
                className="pr-10"
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
          
          <div>
            <Label htmlFor="password2">Confirm Password</Label>
            <div className="mt-1 relative">
              <Input
                id="password2"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <RadioGroup 
              defaultValue="GUARDIAN" 
              className="flex items-center gap-8 mt-2"
              value={formData.user_type}
              onValueChange={handleUserTypeChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TEACHER" id="tutor" />
                <Label htmlFor="tutor">Tutor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="GUARDIAN" id="guardian" />
                <Label htmlFor="guardian">Guardian</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              By creating an account means you agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>{' '}
              and our{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Log in'}
          </Button>
          
          <div className="text-center mt-4">
            <div className="text-sm text-gray-500">Or sign up with</div>
            <div className="flex justify-center space-x-4 mt-2">
              <Button 
                variant="outline" 
                className="w-1/2 flex items-center justify-center"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="mr-2">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              <Button 
                variant="outline"
                className="w-1/2 flex items-center justify-center"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1877F2" viewBox="0 0 24 24" className="mr-2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Back
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
