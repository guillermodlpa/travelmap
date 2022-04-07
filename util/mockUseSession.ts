import { IncomingMessage } from 'http';
import { useEffect, useState } from 'react';
import fixtures from '../fixtures';

type SessionData =
  | undefined
  | null
  | {
      user: {
        name: string;
        email: string;
        image: string;
        id: string;
      };
      expires: Date; // This is the expiry of the session, not any of the tokens within the session
    };
type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

// https://next-auth.js.org/getting-started/client
export const useMockSession = (
  options: { required?: boolean } = {}
): { data: SessionData | null; status: SessionStatus } => {
  const [sessionData, setSessionData] = useState<{
    data: SessionData | null;
    status: SessionStatus;
  }>({ data: null, status: 'loading' });

  useEffect(() => {
    if (!window.localStorage) {
      return;
    }
    const encodedMockSessionData = window.localStorage.getItem('mockSessionData');
    if (!encodedMockSessionData) {
      if (options.required) {
        // takes to sign up page.
      }
      setSessionData({ data: null, status: 'unauthenticated' });
      return;
    }
    const mockSessionData = JSON.parse(encodedMockSessionData);
    setSessionData({ data: mockSessionData, status: 'authenticated' });
  }, []);
  return sessionData;
};

export const getMockSession = ({ req }: { req: unknown }): Promise<SessionData> => {
  return Promise.resolve().then(() => useMockSession().data);
};

export const mockSignIn = (
  provider: string | undefined,
  { callbackUrl }: { callbackUrl: string },
  { _newUser }: { _newUser?: LoggedInUser } = {}
) => {
  if (_newUser) {
    fixtures.users.push(_newUser);
  }
  const user = _newUser || fixtures.users[0];
  const mockSessionData = {
    user: {
      name: user.name,
      email: user.email,
      image: '',
      id: user.id,
    },
    expires: new Date(),
  };
  window.localStorage.setItem('mockSessionData', JSON.stringify(mockSessionData));
  window.location.href = callbackUrl;
};

export const mockSignOut = ({ callbackUrl }: { callbackUrl: string }) => {
  window.localStorage.removeItem('mockSessionData');
  window.location.href = callbackUrl;
};
