
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid OTP');
      return;
    }
    
    setLoading(true);
    try {
      await onVerify(otp);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    // Implement resend OTP functionality here
    setTimeout(() => {
      setResending(false);
      // Show success message for resend
      alert('OTP resent successfully!');
    }, 1000);
  };

  return (
    <div className="text-center">
      <div className="mx-auto w-32 h-32 mb-6">
        <img 
          src="/lovable-uploads/819a862a-8298-4907-949b-d7f0e7e4d237.png" 
          alt="Email verification" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Enter Your Code</h2>
      <p className="text-gray-500 mb-6">
        We send a code to <span className="font-medium">{email}</span>
      </p>
      
      <div className="flex justify-center mb-6">
        <InputOTP 
          value={otp} 
          onChange={setOtp}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot 
                  key={index} 
                  {...slot}
                  className="w-12 h-14 text-xl border-gray-300"
                  index={index} 
                />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>
      
      <div className="text-center mb-6">
        <Button 
          variant="link" 
          onClick={handleResend}
          disabled={resending}
          className="text-blue-600"
        >
          {resending ? 'Sending...' : "Didn't got the code? Resend"}
        </Button>
      </div>
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 mb-4" 
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
      >
        {loading ? 'Verifying...' : 'Send 6 Digit Code'}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </div>
  );
};

export default OTPVerification;
