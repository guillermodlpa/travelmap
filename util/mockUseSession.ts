import { IncomingMessage } from 'http';
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
): { data: SessionData; status: SessionStatus } => {
  if (typeof window === 'undefined') {
    return { data: undefined, status: 'loading' };
  }

  const encodedMockSessionData = window.localStorage.getItem('mockSessionData');
  if (!encodedMockSessionData) {
    if (options.required) {
      // takes to sign up page.
    }
    return { data: null, status: 'unauthenticated' };
  }
  const mockSessionData = JSON.parse(encodedMockSessionData);
  return { data: mockSessionData, status: 'authenticated' };
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
