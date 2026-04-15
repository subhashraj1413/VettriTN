import { useLocalSearchParams } from 'expo-router';
import RequestCertificateScreen from '../../screens/RequestCertificateScreen';

/**
 * Route: /(protected)/request-certificate
 * Optional query param: ?typeId=income  →  pre-selects a certificate type
 * and skips directly to Step 2.
 */
export default function RequestCertificatePage() {
  const { typeId } = useLocalSearchParams<{ typeId?: string }>();
  return <RequestCertificateScreen preselectedTypeId={typeId} />;
}
