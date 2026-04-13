export type AuthUser = {
  email: string;
  id: string;
  name: string;
};

export type Session = {
  token: string;
  user: AuthUser;
};

export type AuthState = {
  hydrated: boolean;
  isAuthenticated: boolean;
  session: Session | null;
};
