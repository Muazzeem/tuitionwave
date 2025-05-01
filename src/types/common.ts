
import { Contract } from "./contract";

export interface RequestRowProps {
    request: Contract;
    showConfirmationDialog: (options: {
      title: string;
      description?: string;
      onConfirm: () => void;
      variant?: string;
    }) => void;
  }

export interface RegistrationData {
  email: string;
  phone: string;
  password1: string;
  password2: string;
  user_type: 'TEACHER' | 'GUARDIAN';
  first_name?: string;
  last_name?: string;
}
