// ─── Certificate Feature Types ─────────────────────────────────────────────

export type CertificateCategory =
  | 'Civil'
  | 'Financial'
  | 'Identity'
  | 'Social'
  | 'Property'
  | 'Educational';

export type CertificateRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'ready';

// ─── Certificate Type Definition ──────────────────────────────────────────

export interface CertificateType {
  id:                 string;
  name:               string;
  nameTa:             string;
  category:           CertificateCategory;
  emoji:              string;
  fee:                number;        // in INR, 0 = Free
  processingDays:     number;
  description:        string;
  requiredDocuments:  RequiredDocument[];
  eligibility:        string;
}

export interface RequiredDocument {
  id:       string;
  label:    string;
  labelTa:  string;
  hint:     string;
  required: boolean;
}

// ─── Form State ────────────────────────────────────────────────────────────

export interface ApplicantDetails {
  fullName:        string;
  dateOfBirth:     string;
  gender:          'Male' | 'Female' | 'Other';
  mobile:          string;
  email:           string;
  aadhaarNumber:   string;
  fatherName:      string;
  address:         string;
  district:        string;
  taluk:           string;
  pincode:         string;
  // Certificate-specific fields
  annualIncome?:   string;   // Income certificate
  communityName?:  string;   // Community certificate
  religion?:       string;   // Community certificate
  placeOfBirth?:   string;   // Birth / Nativity certificate
}

export interface UploadedDocument {
  docId:    string;
  fileName: string;
  fileSize: string;
  uploaded: boolean;
}

// ─── Certificate Request ───────────────────────────────────────────────────

export interface CertificateRequest {
  requestId:          string;
  certificateTypeId:  string;
  certificateName:    string;
  status:             CertificateRequestStatus;
  applicantDetails:   ApplicantDetails;
  uploadedDocuments:  UploadedDocument[];
  submittedAt:        string | null;
  estimatedReadyDate: string | null;
  fee:                number;
  paymentStatus:      'pending' | 'paid' | 'free';
  referenceNumber:    string | null;
}

// ─── Redux State ───────────────────────────────────────────────────────────

export interface CertificatesState {
  // Current request being built
  currentStep:        number;           // 1 = type, 2 = details, 3 = docs, 4 = review
  selectedType:       CertificateType | null;
  applicantDetails:   Partial<ApplicantDetails>;
  uploadedDocuments:  UploadedDocument[];

  // Submission state
  isSubmitting:       boolean;
  submittedRequest:   CertificateRequest | null;
  error:              string | null;

  // My requests history
  myRequests:         CertificateRequest[];
}
