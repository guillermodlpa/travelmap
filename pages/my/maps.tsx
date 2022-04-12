import { Box, Heading, Text } from 'grommet';
import { Suspense, useEffect } from 'react';
import styled from 'styled-components';
import StaticMap from '../../components/Maps/StaticMap';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useMockSession } from '../../util/mockUseSession';
import { useRouter } from 'next/router';
import Parchment from '../../components/Parchment';
import Nav from '../../components/Nav';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SuspenseNoSsr = withNoSsr(Suspense);

const UserMaps: React.FC = () => {
  const { data, status: authStatus } = useMockSession({
    required: true,
  });

  const router = useRouter();
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [authStatus]);

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
              <Box flex>
                <Heading level={2} margin={'0'}>
                  Welcome, {data?.user.name}
                </Heading>
              </Box>
            </Box>

            <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
              <Heading level={4} margin={{ top: '0' }}>
                Your Map
              </Heading>

              <ErrorBoundary fallback={<Text>Could not fetch maps.</Text>}>
                <SuspenseNoSsr
                  fallback={
                    <Box animation={{ delay: 2000, type: 'fadeIn' }}>
                      <Text>Loading...</Text>
                    </Box>
                  }
                >
                  <UserMapList userId={data?.user.id!} />
                </SuspenseNoSsr>
              </ErrorBoundary>
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
                  <CombinedMapsList userId={data?.user.id!} allowDelete={false} />
                </SuspenseNoSsr>
              </ErrorBoundary>
            </Box>
          </Parchment>
        </PrincipalParchmentContainer>
      )}
    </>
  );
};

export default UserMaps;
