export interface EducationFormData {
  degree: string;
  institute: string;
  department: string;
  currentStatus: string;
  cvDocument: File | null;
  cv_document_url?: string | null;
}

export interface EducationInfoResponse {
    degree: { id: number; name: string } | null;
    institute: { id: number; name: string } | null;
    department: { id: number; name: string } | null;
    current_status_display: string;
    cv_document: string | null;
}

export interface EducationFormProps {
  formData: EducationFormData;
  updateFormData: (data: Partial<EducationFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}
