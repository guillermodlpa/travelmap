import { Box, Button, Heading, Text } from 'grommet';
import { Suspense, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import StaticMap from '../components/Maps/StaticMap';
import withNoSsr from '../components/NoSsr/withNoSsr';
import UserMapList from '../components/MapList/UserMapList';
import ErrorBoundary from '../components/ErrorBoundary';
import ThemeModeToggle from '../components/ThemeMode/ThemeModeToggle';
import fixtures from '../fixtures';
import UserMenu from '../components/UserMenu';
import { useMockSession } from '../util/mockUseSession';
import { useRouter } from 'next/router';

const BoxRelative = styled(Box)`
  position: relative;
`;

const ButtonTextCentered = styled(Button)`
  text-align: center;
`;

const Parchment: React.FC = ({ children }) => (
  <BoxRelative pad={{ vertical: 'large', horizontal: 'medium' }} align="center" height="100%">
    <Box background="paper" pad="large" elevation="small" width="large" overflow="auto">
      {children}
    </Box>
  </BoxRelative>
);

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SuspenseNoSsr = withNoSsr(Suspense);

const UserMaps: React.FC = () => {
  console.log('theme', useTheme());
  console.log('fixtures', fixtures);

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

      <ThemeModeToggle />

      <UserMenu />

      {authStatus === 'authenticated' && (
        <Parchment>
          <Heading level={2} margin={{ top: '0' }}>
            Welcome, {data?.user.name}
          </Heading>

          <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
            <Heading level={4} margin={{ top: '0' }}>
              Your Maps
            </Heading>

            <ErrorBoundary fallback={<Text>Could not fetch recent maps.</Text>}>
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
        </Parchment>
      )}
    </>
  );
};

export default UserMaps;
