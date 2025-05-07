
import { useState } from 'react';

interface ValidationErrors {
  selectedDays?: string;
  selectedSubjects?: string;
  studentCity?: string;
  studentArea?: string;
  studentInstitution?: string;
  studentClass?: string;
  studentDepartment?: string;
  tuitionType?: string;
  memberCount?: string;
  preferredGender?: string;
  selectedAmount?: string;
}

interface FormValues {
  selectedDays: string[];
  selectedSubjects: string[];
  studentCity: string;
  studentArea: string;
  studentInstitution: string;
  studentClass: string;
  studentDepartment: string;
  tuitionType: string;
  memberCount: string;
  preferredGender: string;
  selectedAmount: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidationError, setShowValidationError] = useState(false);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (values: FormValues) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all required fields
    if (values.selectedDays.length === 0) {
      newErrors.selectedDays = "Please select at least one day";
      isValid = false;
    }

    if (values.selectedSubjects.length === 0) {
      newErrors.selectedSubjects = "Please select at least one subject";
      isValid = false;
    }

    if (!values.studentCity) {
      newErrors.studentCity = "City is required";
      isValid = false;
    }

    if (!values.studentArea) {
      newErrors.studentArea = "Area is required";
      isValid = false;
    }

    if (!values.studentInstitution.trim()) {
      newErrors.studentInstitution = "Institution is required";
      isValid = false;
    }

    if (!values.studentClass) {
      newErrors.studentClass = "Class is required";
      isValid = false;
    }

    if (!values.studentDepartment) {
      newErrors.studentDepartment = "Department is required";
      isValid = false;
    }

    if (!values.tuitionType) {
      newErrors.tuitionType = "Tuition type is required";
      isValid = false;
    }

    if (!values.memberCount) {
      newErrors.memberCount = "Member count is required";
      isValid = false;
    }

    if (!values.preferredGender) {
      newErrors.preferredGender = "Gender preference is required";
      isValid = false;
    }

    if (!values.selectedAmount || parseFloat(values.selectedAmount) <= 0) {
      newErrors.selectedAmount = "Please enter a valid amount";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    setErrors,
    showValidationError,
    setShowValidationError,
    validateForm,
    clearFieldError
  };
};
