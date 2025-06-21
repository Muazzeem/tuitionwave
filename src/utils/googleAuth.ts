import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  nbf: any;
  jti: any;
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export class GoogleIdentityManager {
  private static instance: GoogleIdentityManager;
  private isInitialized = false;
  private google: any = null;

  private constructor() {}

  static getInstance(): GoogleIdentityManager {
    if (!GoogleIdentityManager.instance) {
      GoogleIdentityManager.instance = new GoogleIdentityManager();
    }
    return GoogleIdentityManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.google = window.google;
        if (this.google?.accounts?.id) {
          this.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: () => {}, // Will be overridden in individual components
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };
      
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  async promptOneTap(callback: (response: GoogleCredentialResponse) => void): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap was not displayed or was skipped
        console.log('One Tap was not displayed or skipped');
      }
    });
  }

  async renderButton(
    element: HTMLElement, 
    callback: (response: GoogleCredentialResponse) => void,
    options: any = {}
  ): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Update the callback
    this.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    const defaultOptions = {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%',
    };

    this.google.accounts.id.renderButton(element, { ...defaultOptions, ...options });
  }

  decodeCredential(credential: string): GoogleUser {
    return jwtDecode<GoogleUser>(credential);
  }

  async revokeAccess(): Promise<void> {
    if (this.google?.accounts?.id) {
      this.google.accounts.id.revoke();
    }
  }
}