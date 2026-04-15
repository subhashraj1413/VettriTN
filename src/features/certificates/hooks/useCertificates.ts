import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../lib/store';
import {
  certificatesActions,
  submitCertificateRequest,
} from '../store/certificates.store';
import type { CertificateType, ApplicantDetails } from '../types';

export const useCertificates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.certificates);

  return {
    // State
    currentStep:       state.currentStep,
    selectedType:      state.selectedType,
    applicantDetails:  state.applicantDetails,
    uploadedDocuments: state.uploadedDocuments,
    isSubmitting:      state.isSubmitting,
    submittedRequest:  state.submittedRequest,
    error:             state.error,
    myRequests:        state.myRequests,

    // Computed
    allRequiredUploaded: state.selectedType
      ? state.selectedType.requiredDocuments
          .filter(d => d.required)
          .every(d =>
            state.uploadedDocuments.find(u => u.docId === d.id)?.uploaded,
          )
      : false,

    // Actions
    setStep:          (step: number) => dispatch(certificatesActions.setStep(step)),
    nextStep:         () => dispatch(certificatesActions.nextStep()),
    prevStep:         () => dispatch(certificatesActions.prevStep()),
    selectType:       (type: CertificateType) =>
      dispatch(certificatesActions.selectCertificateType(type)),
    updateDetails:    (details: Partial<ApplicantDetails>) =>
      dispatch(certificatesActions.updateApplicantDetails(details)),
    prefillFromSession: (data: Partial<ApplicantDetails>) =>
      dispatch(certificatesActions.prefillFromSession(data)),
    markUploaded:     (docId: string, fileName: string, fileSize: string) =>
      dispatch(certificatesActions.markDocumentUploaded({ docId, fileName, fileSize })),
    removeDoc:        (docId: string) =>
      dispatch(certificatesActions.removeUploadedDocument(docId)),
    submit:           () => dispatch(submitCertificateRequest()),
    resetFlow:        () => dispatch(certificatesActions.resetFlow()),
    clearError:       () => dispatch(certificatesActions.clearError()),
  };
};
