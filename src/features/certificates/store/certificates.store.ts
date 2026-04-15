import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  CertificatesState,
  CertificateType,
  ApplicantDetails,
  UploadedDocument,
  CertificateRequest,
} from '../types';
import { certificateService } from '../../../services/certificateService';

// ─── Initial State ─────────────────────────────────────────────────────────

const initialState: CertificatesState = {
  currentStep:       1,
  selectedType:      null,
  applicantDetails:  {},
  uploadedDocuments: [],
  isSubmitting:      false,
  submittedRequest:  null,
  error:             null,
  myRequests:        [],
};

// ─── Async Thunk: Submit Certificate Request ───────────────────────────────

export const submitCertificateRequest = createAsyncThunk<
  CertificateRequest,
  void,
  { state: { certificates: CertificatesState } }
>(
  'certificates/submit',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().certificates;
    if (!state.selectedType) {
      return rejectWithValue('No certificate type selected');
    }
    try {
      const result = await certificateService.submitRequest({
        certificateType:   state.selectedType,
        applicantDetails:  state.applicantDetails as ApplicantDetails,
        uploadedDocuments: state.uploadedDocuments,
      });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      return rejectWithValue(msg);
    }
  },
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState,
  reducers: {
    // Step navigation
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    prevStep(state) {
      if (state.currentStep > 1) state.currentStep -= 1;
    },

    // Step 1 – Certificate type selection
    selectCertificateType(state, action: PayloadAction<CertificateType>) {
      state.selectedType = action.payload;
      // Pre-seed upload entries from required documents
      state.uploadedDocuments = action.payload.requiredDocuments.map(doc => ({
        docId:    doc.id,
        fileName: '',
        fileSize: '',
        uploaded: false,
      }));
    },

    // Step 2 – Applicant details
    updateApplicantDetails(
      state,
      action: PayloadAction<Partial<ApplicantDetails>>,
    ) {
      state.applicantDetails = { ...state.applicantDetails, ...action.payload };
    },

    // Pre-fill details from user session
    prefillFromSession(
      state,
      action: PayloadAction<Partial<ApplicantDetails>>,
    ) {
      // Only fill fields that aren't already set
      const existing = state.applicantDetails;
      const incoming = action.payload;
      const merged: Partial<ApplicantDetails> = { ...incoming };
      (Object.keys(existing) as (keyof ApplicantDetails)[]).forEach(key => {
        if (existing[key]) merged[key] = existing[key] as never;
      });
      state.applicantDetails = merged;
    },

    // Step 3 – Document uploads
    markDocumentUploaded(
      state,
      action: PayloadAction<{ docId: string; fileName: string; fileSize: string }>,
    ) {
      const doc = state.uploadedDocuments.find(d => d.docId === action.payload.docId);
      if (doc) {
        doc.uploaded  = true;
        doc.fileName  = action.payload.fileName;
        doc.fileSize  = action.payload.fileSize;
      }
    },
    removeUploadedDocument(state, action: PayloadAction<string>) {
      const doc = state.uploadedDocuments.find(d => d.docId === action.payload);
      if (doc) {
        doc.uploaded  = false;
        doc.fileName  = '';
        doc.fileSize  = '';
      }
    },

    // Reset the entire flow (e.g. after success or cancel)
    resetFlow(state) {
      state.currentStep       = 1;
      state.selectedType      = null;
      state.applicantDetails  = {};
      state.uploadedDocuments = [];
      state.isSubmitting      = false;
      state.submittedRequest  = null;
      state.error             = null;
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(submitCertificateRequest.pending, state => {
        state.isSubmitting = true;
        state.error        = null;
      })
      .addCase(submitCertificateRequest.fulfilled, (state, action) => {
        state.isSubmitting    = false;
        state.submittedRequest = action.payload;
        state.myRequests.unshift(action.payload);
      })
      .addCase(submitCertificateRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error        = (action.payload as string) ?? 'Unknown error';
      });
  },
});

export const certificatesActions = certificatesSlice.actions;
export const certificatesReducer = certificatesSlice.reducer;
