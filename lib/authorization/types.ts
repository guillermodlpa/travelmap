import { ReactNode } from 'react';

export type AuthorizationHookReturnValue =
  | {
      error: undefined;
      loading: false;
      canAccess: boolean;
    }
  | {
      error: undefined;
      loading: true;
      canAccess: false;
    }
  | {
      error: Error;
      loading: false;
      canAccess: false;
    };

export type AuthorizationComponentProps = {
  children: ReactNode;
  forbiddenFallback?: ReactNode;
  errorFallback?: ReactNode;
  loadingFallback?: ReactNode;
};
