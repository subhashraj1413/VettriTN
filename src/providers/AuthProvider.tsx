import React, { useEffect } from 'react';

import { authActions } from '../features/auth/store/auth.store';
import { readSession } from '../lib/storage/preferencesStorage';
import { useAppDispatch } from '../lib/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    readSession()
      .then(session => {
        dispatch(authActions.hydrateSession(session));
      })
      .catch(() => {
        dispatch(authActions.finishHydration());
      });
  }, [dispatch]);

  return <>{children}</>;
}
