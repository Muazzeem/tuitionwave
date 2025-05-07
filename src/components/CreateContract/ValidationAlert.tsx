
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationAlertProps {
  show: boolean;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Please fill in all required fields before submitting.
      </AlertDescription>
    </Alert>
  );
};

export default ValidationAlert;
