import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GoogleIdentityManager, GoogleCredentialResponse } from '@/utils/googleAuth';

interface CustomGoogleButtonProps {
  onSuccess: (userData: any) => void;
  disabled?: boolean;
}

const GoogleLoginButton: React.FC<CustomGoogleButtonProps> = ({ 
  onSuccess, 
  disabled = false 
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  

  const handleGoogleLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const googleIdentity = GoogleIdentityManager.getInstance();
      await googleIdentity.initialize();

      // Create a temporary element for the Google button
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      await googleIdentity.renderButton(
        tempDiv,
        handleCredentialResponse,
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
        }
      );

      // Trigger the Google button click
      const googleButton = tempDiv.querySelector('div[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      }

      // Clean up
      setTimeout(() => {
        document.body.removeChild(tempDiv);
      }, 1000);
      
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google Login Failed",
        description: error instanceof Error ? error.message : "Failed to initialize Google login",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
    try {
      const googleIdentity = GoogleIdentityManager.getInstance();
      const userInfo = googleIdentity.decodeCredential(response.credential);

      const apiPayload = {
        id_token: response.credential,
        user_info: {
          iss: userInfo.iss,
          aud: userInfo.aud,
          azp: userInfo.azp,
          sub: userInfo.sub,
          email: userInfo.email,
          email_verified: userInfo.email_verified,
          name: userInfo.name,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          picture: userInfo.picture,
          iat: userInfo.iat,
          exp: userInfo.exp,
          nbf: userInfo.nbf,
          jti: userInfo.jti,
        },
      };

      const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'Google login failed');
      }

      const userData = await apiResponse.json();
      onSuccess(userData);

    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-14 bg-cyan-500 border-0 hover:bg-cyan-500 text-black font-semibold py-3 rounded-xl text-lg"
      onClick={handleGoogleLogin}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center space-x-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className='text-lg sm:text-md'>{loading ? 'Initializing...' : 'Continue with Google'}</span>
      </div>
    </Button>
  );
};

export default GoogleLoginButton;