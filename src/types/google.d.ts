
interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleAuthResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleAuth {
  initialize: (config: GoogleAuthConfig) => void;
  renderButton: (element: HTMLElement, config: any) => void;
  disableAutoSelect: () => void;
}

interface GoogleAccounts {
  id: GoogleAuth;
}

interface GoogleGlobal {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google: GoogleGlobal;
  }
}

export {};
