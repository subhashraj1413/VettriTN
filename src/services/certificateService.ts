// ─── Certificate Service ───────────────────────────────────────────────────
// Mock service layer — swap the implementations for real API calls when the
// backend is ready. All public method signatures stay the same.

import type {
  CertificateType,
  CertificateRequest,
  ApplicantDetails,
  UploadedDocument,
} from '../features/certificates/types';

// ─── Certificate Catalogue ─────────────────────────────────────────────────

export const CERTIFICATE_TYPES: CertificateType[] = [
  // ── Civil ─────────────────────────────────────────────────────────────
  {
    id:             'birth',
    name:           'Birth Certificate',
    nameTa:         'பிறப்புச் சான்றிதழ்',
    category:       'Civil',
    emoji:          '👶',
    fee:            20,
    processingDays: 3,
    description:    'Official record of birth issued by the Local Body / Municipality.',
    eligibility:    'Any citizen born in Tamil Nadu',
    requiredDocuments: [
      { id: 'hospital_record', label: 'Hospital Birth Record / Discharge Summary',    labelTa: 'மருத்துவமனை பதிவு',                required: true,  hint: 'PDF or scanned copy' },
      { id: 'parent_aadhaar',  label: "Parent's Aadhaar Card",                         labelTa: 'பெற்றோர் ஆதார் அட்டை',            required: true,  hint: 'Front and back' },
      { id: 'marriage_cert',   label: "Parent's Marriage Certificate",                  labelTa: 'திருமண சான்றிதழ்',                required: false, hint: 'If available' },
    ],
  },
  {
    id:             'nativity',
    name:           'Nativity Certificate',
    nameTa:         'சொந்த ஊர் சான்றிதழ்',
    category:       'Civil',
    emoji:          '🏡',
    fee:            0,
    processingDays: 5,
    description:    'Certifies that the applicant is a native of Tamil Nadu.',
    eligibility:    'Residents of Tamil Nadu',
    requiredDocuments: [
      { id: 'aadhaar',         label: 'Aadhaar Card',              labelTa: 'ஆதார் அட்டை',                   required: true,  hint: 'Self-attested copy' },
      { id: 'ration_card',     label: 'Ration Card',               labelTa: 'ரேஷன் அட்டை',                   required: true,  hint: 'Family ration card' },
      { id: 'school_cert',     label: 'School Transfer Certificate', labelTa: 'பள்ளி மாற்று சான்றிதழ்',       required: false, hint: 'Any class TC' },
      { id: 'revenue_record',  label: 'Revenue Village Record',    labelTa: 'வருவாய் கிராம ஆவணம்',           required: false, hint: 'Patta or Chitta' },
    ],
  },
  {
    id:             'death',
    name:           'Death Certificate',
    nameTa:         'இறப்புச் சான்றிதழ்',
    category:       'Civil',
    emoji:          '📋',
    fee:            20,
    processingDays: 3,
    description:    'Official record of death issued by the Local Body.',
    eligibility:    'Family members of deceased',
    requiredDocuments: [
      { id: 'hospital_death',  label: 'Hospital Death Record / Cause of Death Certificate', labelTa: 'மருத்துவமனை இறப்பு பதிவு', required: true,  hint: 'Issued by attending doctor' },
      { id: 'deceased_id',     label: "Deceased Person's ID Proof",                          labelTa: 'இறந்தவரின் அடையாளச் சான்று', required: true,  hint: 'Aadhaar / Voter ID' },
      { id: 'applicant_id',    label: "Applicant's Aadhaar Card",                            labelTa: 'விண்ணப்பதாரர் ஆதார் அட்டை', required: true,  hint: 'Self-attested' },
    ],
  },

  // ── Financial ──────────────────────────────────────────────────────────
  {
    id:             'income',
    name:           'Income Certificate',
    nameTa:         'வருமானச் சான்றிதழ்',
    category:       'Financial',
    emoji:          '💰',
    fee:            0,
    processingDays: 7,
    description:    'Certifies the annual family income for welfare scheme eligibility.',
    eligibility:    'All Tamil Nadu residents',
    requiredDocuments: [
      { id: 'aadhaar',         label: 'Aadhaar Card',              labelTa: 'ஆதார் அட்டை',                   required: true,  hint: 'Self-attested copy' },
      { id: 'ration_card',     label: 'Ration Card',               labelTa: 'ரேஷன் அட்டை',                   required: true,  hint: 'All pages' },
      { id: 'income_proof',    label: 'Income Proof',              labelTa: 'வருமான சான்று',                  required: true,  hint: 'Salary slip / Bank passbook / Employer letter' },
      { id: 'self_declaration',label: 'Self Declaration',          labelTa: 'சுய அறிவிப்பு',                 required: true,  hint: 'Signed on Rs.20 stamp paper' },
    ],
  },

  // ── Social ─────────────────────────────────────────────────────────────
  {
    id:             'community',
    name:           'Community Certificate',
    nameTa:         'சமுதாய சான்றிதழ்',
    category:       'Social',
    emoji:          '🤝',
    fee:            0,
    processingDays: 5,
    description:    'Certifies caste/community for reservation benefits in education & employment.',
    eligibility:    'SC / ST / MBC / BC / OBC residents of Tamil Nadu',
    requiredDocuments: [
      { id: 'aadhaar',         label: 'Aadhaar Card',              labelTa: 'ஆதார் அட்டை',                   required: true,  hint: 'Self-attested copy' },
      { id: 'ration_card',     label: 'Ration Card',               labelTa: 'ரேஷன் அட்டை',                   required: true,  hint: 'Family ration card' },
      { id: 'parent_community',label: "Parent's Community Certificate", labelTa: 'பெற்றோர் சமுதாய சான்றிதழ்', required: false, hint: 'If available' },
      { id: 'school_cert',     label: 'School Records',            labelTa: 'பள்ளி ஆவணங்கள்',                required: false, hint: 'TC or Mark sheet' },
    ],
  },

  // ── Property ───────────────────────────────────────────────────────────
  {
    id:             'residence',
    name:           'Residence Certificate',
    nameTa:         'வசிப்பிட சான்றிதழ்',
    category:       'Property',
    emoji:          '🏠',
    fee:            0,
    processingDays: 5,
    description:    'Confirms the applicant\'s current place of residence in Tamil Nadu.',
    eligibility:    'Residents of Tamil Nadu',
    requiredDocuments: [
      { id: 'aadhaar',         label: 'Aadhaar Card',              labelTa: 'ஆதார் அட்டை',                   required: true,  hint: 'Must show current address' },
      { id: 'ration_card',     label: 'Ration Card',               labelTa: 'ரேஷன் அட்டை',                   required: true,  hint: 'Current address' },
      { id: 'utility_bill',    label: 'Electricity / Water Bill',  labelTa: 'மின்சார / தண்ணீர் பில்',        required: false, hint: 'Last 3 months' },
    ],
  },

  // ── Educational ────────────────────────────────────────────────────────
  {
    id:             'first_graduate',
    name:           'First Graduate Certificate',
    nameTa:         'முதல் பட்டதாரி சான்றிதழ்',
    category:       'Educational',
    emoji:          '🎓',
    fee:            0,
    processingDays: 7,
    description:    'Certifies first graduate status for scholarship and employment benefits.',
    eligibility:    'First person in immediate family to obtain a degree',
    requiredDocuments: [
      { id: 'aadhaar',         label: 'Aadhaar Card',              labelTa: 'ஆதார் அட்டை',                   required: true,  hint: 'Self-attested' },
      { id: 'degree_cert',     label: 'Degree / Provisional Certificate', labelTa: 'பட்டப்படிப்பு சான்றிதழ்', required: true, hint: 'Issued by University' },
      { id: 'family_edu_decl', label: 'Family Education Declaration', labelTa: 'குடும்ப கல்வி அறிவிப்பு',    required: true,  hint: 'Signed self-declaration' },
    ],
  },
];

// ─── Service Methods ───────────────────────────────────────────────────────

function generateRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random    = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CERT-${timestamp}-${random}`;
}

function generateReferenceNumber(): string {
  const year  = new Date().getFullYear();
  const seq   = Math.floor(Math.random() * 90000) + 10000;
  return `TN/${year}/CERT/${seq}`;
}

function addWorkingDays(days: number): string {
  const date = new Date();
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) added++;
  }
  return date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export const certificateService = {
  // ── Get all certificate types ──────────────────────────────────────────
  getCertificateTypes(): Promise<CertificateType[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(CERTIFICATE_TYPES), 400);
    });
  },

  // ── Get single type by id ──────────────────────────────────────────────
  getCertificateTypeById(id: string): CertificateType | undefined {
    return CERTIFICATE_TYPES.find(c => c.id === id);
  },

  // ── Submit a certificate request ───────────────────────────────────────
  submitRequest(payload: {
    certificateType:   CertificateType;
    applicantDetails:  ApplicantDetails;
    uploadedDocuments: UploadedDocument[];
  }): Promise<CertificateRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional network error (1 in 20 chance)
        if (Math.random() < 0.05) {
          reject(new Error('Network error. Please try again.'));
          return;
        }

        const now = new Date().toISOString();
        const request: CertificateRequest = {
          requestId:          generateRequestId(),
          certificateTypeId:  payload.certificateType.id,
          certificateName:    payload.certificateType.name,
          status:             'submitted',
          applicantDetails:   payload.applicantDetails,
          uploadedDocuments:  payload.uploadedDocuments,
          submittedAt:        now,
          estimatedReadyDate: addWorkingDays(payload.certificateType.processingDays),
          fee:                payload.certificateType.fee,
          paymentStatus:      payload.certificateType.fee === 0 ? 'free' : 'pending',
          referenceNumber:    generateReferenceNumber(),
        };
        resolve(request);
      }, 1500); // Simulate API latency
    });
  },

  // ── Get requests by citizen (mock) ─────────────────────────────────────
  getMyRequests(): Promise<CertificateRequest[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([]), 300);
    });
  },

  // ── Simulate document upload ───────────────────────────────────────────
  uploadDocument(_docId: string, _fileName: string): Promise<{ success: boolean }> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 800);
    });
  },
};
