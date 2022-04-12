import {
  Box,
  Button,
  CheckBox,
  FormField,
  Heading,
  ResponsiveContext,
  Text,
  TextInput,
} from 'grommet';
import { Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import StaticMap from '../../components/Maps/StaticMap';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import { mockSignOut, useMockSession } from '../../util/mockUseSession';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Parchment from '../../components/Parchment';
import Nav from '../../components/Nav';
import { Previous } from 'grommet-icons';
import WrappingDialogConfirmation from '../../components/ConfirmationDialog/WrappingDialogConfirmation';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SuspenseNoSsr = withNoSsr(Suspense);

const UserSettings: React.FC = () => {
  const { data, status: authStatus } = useMockSession({
    required: true,
  });

  const router = useRouter();
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [authStatus]);

  const size = useContext(ResponsiveContext);

  const [notifyOnCombinedMaps, setNotifyOnCombinedMap] = useState<boolean>(true);
  const [notifyOnAppUpdates, setNotifyOnAppUpdates] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>('Guillermo');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useLayoutEffect(() => {
    setHasChanges(true);
  }, [notifyOnCombinedMaps, notifyOnAppUpdates, displayName]);

  return (
    <>
      <FullScreenBackground>
        <StaticMap height="100vh" id="background-map" />
      </FullScreenBackground>

      <Nav />

      {authStatus === 'authenticated' && (
        <PrincipalParchmentContainer>
          <Parchment contentPad="large">
            <Box direction="row" margin={{ bottom: 'medium' }} align="center" gap="medium" wrap>
              <NextLink passHref href="/my/maps">
                <Button a11yTitle="Back to My Maps" icon={<Previous color="brand" />} />
              </NextLink>

              <Box flex>
                <Heading level={2} margin={'0'}>
                  {`${data?.user.name}'s Settings`}
                </Heading>
              </Box>
            </Box>

            <Box direction={size === 'small' ? 'column' : 'row'} gap="small">
              <Box
                margin={{ vertical: 'large' }}
                flex={{ shrink: 0 }}
                width={size === 'small' ? 'auto' : '50%'}
                gap="medium"
              >
                <Heading level={4} margin={'0'}>
                  Notifications
                </Heading>

                <CheckBox
                  checked={notifyOnCombinedMaps}
                  label="When somebody makes a combined map with me"
                  onChange={(event) => {
                    setNotifyOnCombinedMap(event.target.checked);
                  }}
                />

                <CheckBox
                  checked={notifyOnAppUpdates}
                  label="Updates about Travelmap"
                  onChange={(event) => {
                    setNotifyOnAppUpdates(event.target.checked);
                  }}
                />
              </Box>

              <Box
                margin={{ vertical: 'large' }}
                flex={{ shrink: 0 }}
                width={size === 'small' ? 'auto' : '50%'}
                gap="medium"
              >
                <Heading level={4} margin={'0'}>
                  User
                </Heading>

                <FormField
                  label="Display name"
                  htmlFor="display-name-input" /* @todo: replace for React 18's useId */
                  required
                >
                  <TextInput
                    value={displayName}
                    id="display-name-input"
                    onChange={(event) => {
                      setDisplayName(event.target.value);
                    }}
                  />
                </FormField>

                <Text>Auth provider: Google</Text>
              </Box>
            </Box>

            <Box>
              <Button
                alignSelf="center"
                label="Save"
                disabled={!hasChanges}
                onClick={() => {
                  setTimeout(() => {
                    setHasChanges(false);
                  }, 500);
                }}
              />
            </Box>

            <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
              <Heading level={4} margin={{ top: '0' }}>
                {`"Together" Maps`}
              </Heading>

              <ErrorBoundary fallback={<Text>Could not fetch maps.</Text>}>
                <SuspenseNoSsr
                  fallback={
                    <Box animation={{ delay: 2000, type: 'fadeIn' }}>
                      <Text>Loading...</Text>
                    </Box>
                  }
                >
                  <CombinedMapsList userId={data?.user.id!} allowDelete={true} />
                </SuspenseNoSsr>
              </ErrorBoundary>
            </Box>

            <Box
              margin={{ vertical: 'large' }}
              flex={{ shrink: 0 }}
              width={size === 'small' ? 'auto' : '50%'}
              gap="medium"
              alignSelf="end"
            >
              <Heading level={4} margin={'0'}>
                Account
              </Heading>

              <WrappingDialogConfirmation
                onConfirm={() => {
                  alert('deleted');
                  mockSignOut({ callbackUrl: '/' });
                }}
                confirmButtonLabel="Delete account"
                confirmMessage="Are you sure that you want to delete your account and data?"
              >
                {(handleClick) => (
                  <Button
                    label="Delete Account"
                    color="border"
                    alignSelf="end"
                    onClick={handleClick}
                  />
                )}
              </WrappingDialogConfirmation>
            </Box>
          </Parchment>
        </PrincipalParchmentContainer>
      )}
    </>
  );
};

export default UserSettings;
