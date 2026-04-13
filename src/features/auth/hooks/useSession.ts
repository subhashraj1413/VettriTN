import { authActions } from '../store/auth.store';
import { clearSession } from '../../../lib/storage/preferencesStorage';
import { useAppDispatch, useAppSelector } from '../../../lib/store';

export const useSession = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);

  return {
    ...auth,
    signOut: () => {
      clearSession();
      dispatch(authActions.signOut());
    },
  };
};
