import { Box, Heading, Paragraph, Text } from 'grommet';
import { ReactElement, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useMockSession } from '../../util/mockUseSession';
import { useRouter } from 'next/router';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import StaticMapBackgroundLayout from '../../components/Layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';

const SuspenseNoSsr = withNoSsr(Suspense);

const UserMaps: NextPageWithLayout = () => {
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
      <HeadWithDefaults title="Travelmap - My Maps" />

      {authStatus === 'authenticated' && (
        <PrincipalParchmentContainer width="xlarge">
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

              <Paragraph fill size="small">
                Find Travelmaps of your friends to create maps together
              </Paragraph>
            </Box>
          </Parchment>
        </PrincipalParchmentContainer>
      )}
    </>
  );
};

UserMaps.getLayout = function getLayout(page: ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default UserMaps;
