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