
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerify }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      await onVerify(otp);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="text-center">
      <div className="mx-auto w-32 h-32 mb-6">
        <img
          src="/lovable-uploads/819a862a-8298-4907-949b-d7f0e7e4d237.png"
          alt="OTP Input"
          className="w-full h-full object-contain"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">Enter Your Code</h2>
      <p className="text-gray-400 mb-6">Please enter the verification code.</p>

      <div className="flex justify-center mb-6">
        <InputOTP
          maxLength={6}
          containerClassName="gap-2"
          className="w-full flex items-center justify-center gap-2"
          value={otp}
          onChange={handleOtpChange}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-12 h-14 text-xl border-gray-600 bg-gray-800 text-white rounded text-center focus:border-cyan-500 focus:ring-cyan-500 focus:ring-1"
            />
          ))}
        </InputOTP>
      </div>

      <Button
        className="w-full min-h-[55px] bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-semibold mb-4 transition-colors"
        onClick={handleVerify}
        disabled={loading || !otp || otp.length !== 6}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      <Button
        variant="outline"
        className="w-full border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-colors"
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </div>
  );
};

export default OTPVerification;
