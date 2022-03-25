import { Box, Button, Heading, Paragraph, ResponsiveContext, Text } from 'grommet';
import { useContext, Suspense } from 'react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';
import styled, { useTheme } from 'styled-components';
import StaticMap from '../components/Maps/StaticMap';
import withNoSsr from '../components/NoSsr/withNoSsr';
import UserMapList from '../components/MapList/UserMapList';
import ErrorBoundary from '../components/ErrorBoundary';
import ThemeModeToggle from '../components/ThemeMode/ThemeModeToggle';
import fixtures from '../fixtures';

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

const UserMaps: React.FC<{ loggedInUser: LoggedInUser }> = ({ loggedInUser }) => {
  console.log(useTheme());
  const size = useContext(ResponsiveContext);

  return (
    <>
      <FullScreenBackground>
        <StaticMap height="100vh" id="background-map" />
      </FullScreenBackground>

      <ThemeModeToggle />

      <Parchment>
        <Heading level={2} margin={{ top: '0' }}>
          Welcome, {loggedInUser.name}
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
              <UserMapList userId={loggedInUser.id} />
            </SuspenseNoSsr>
          </ErrorBoundary>
        </Box>
      </Parchment>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  { loggedInUser: LoggedInUser },
  {}
> = async () => {
  const loggedInUser = fixtures.users[3];
  return { props: { loggedInUser } };
};

export default UserMaps;
