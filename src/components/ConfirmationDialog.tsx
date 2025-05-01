
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, X, Trash2, Navigation } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant: 'approve' | 'reject' | 'cancel' | 'confirmation';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'approve':
        return <Check className="h-6 w-6 text-green-600" />;
      case 'reject':
        return <X className="h-6 w-6 text-red-600" />;
      case 'cancel':
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case 'confirmation':
        return <Navigation className="h-6 w-6 text-gray-600" />;
    }
  };

  const getActionClass = () => {
    switch (variant) {
      case 'approve':
        return 'bg-green-600 hover:bg-green-700';
      case 'reject':
        return 'bg-red-600 hover:bg-red-700';
      case 'cancel':
        return 'bg-red-600 hover:bg-red-700';
      case 'confirmation':
        return 'bg-blue-600 hover:bg-blue-700'; 
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className="text-xl font-bold text-center">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-4">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={getActionClass()}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
