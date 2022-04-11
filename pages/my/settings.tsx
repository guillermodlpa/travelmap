import { Avatar, Box, Button, CheckBox, Heading, ResponsiveContext, Text } from 'grommet';
import { Suspense, useContext, useEffect } from 'react';
import styled from 'styled-components';
import StaticMap from '../../components/Maps/StaticMap';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useMockSession } from '../../util/mockUseSession';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Parchment from '../../components/Parchment';
import Nav from '../../components/Nav';
import { Previous } from 'grommet-icons';

const RelativeBox = styled(Box)`
  position: relative;
`;

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

  return (
    <>
      <FullScreenBackground>
        <StaticMap height="100vh" id="background-map" />
      </FullScreenBackground>

      <Nav />

      {authStatus === 'authenticated' && (
        <RelativeBox align="center" pad={{ top: 'xlarge', bottom: 'medium', horizontal: 'medium' }}>
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
                  checked={true}
                  label="When somebody makes a combined map with me"
                  onChange={(event) => {}}
                />

                <CheckBox checked={true} label="Updates about Travelmap" onChange={(event) => {}} />
              </Box>

              <Box
                margin={{ vertical: 'large' }}
                flex={{ shrink: 0 }}
                width={size === 'small' ? 'auto' : '50%'}
                gap="medium"
              >
                <Heading level={4} margin={'0'}>
                  Account
                </Heading>

                <Button label="Delete Account" color="border" />
              </Box>
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
          </Parchment>
        </RelativeBox>
      )}
    </>
  );
};

export default UserSettings;
