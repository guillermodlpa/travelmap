import { Box, Button, Heading, Paragraph, ResponsiveContext, Text } from 'grommet';
import { useContext, Suspense } from 'react';
import NextLink from 'next/link';
import styled, { useTheme } from 'styled-components';
import StaticMap from '../components/Maps/StaticMap';
import withNoSsr from '../components/NoSsr/withNoSsr';
import RecentMapsList from '../components/MapList/RecentMapsList';
import ErrorBoundary from '../components/ErrorBoundary';
import { mockSignIn, useMockSession } from '../util/mockUseSession';
import Parchment from '../components/Parchment';
import Nav from '../components/Nav';

const ButtonTextCentered = styled(Button)`
  text-align: center;
`;

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

const Welcome: React.FC = () => {
  console.log(useTheme());
  const size = useContext(ResponsiveContext);

  const { status: authStatus } = useMockSession();

  return (
    <>
      <FullScreenBackground>
        <StaticMap height="100vh" id="background-map" />
      </FullScreenBackground>

      <Nav />

      <RelativeBox align="center" pad={{ top: 'xlarge', bottom: 'medium', horizontal: 'medium' }}>
        <Parchment contentPad="large">
          <Heading level={2} margin={{ top: '0' }}>
            Welcome, traveler
          </Heading>

          <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
            <Paragraph margin={{ top: '0' }} fill size="large">
              “Why do you go away? So that you can come back. So that you can see the place you came
              from with new eyes and extra colors. And the people there see you differently, too.
              Coming back to where you started is not the same as never leaving.”
            </Paragraph>
            <Paragraph fill textAlign="end" margin={{ top: '0' }}>
              ― Terry Pratchett, A Hat Full of Sky
            </Paragraph>
          </Box>

          <Box direction={size === 'small' ? 'column' : 'row'} gap="medium" flex={{ shrink: 0 }}>
            {authStatus === 'authenticated' ? (
              <Box fill>
                <NextLink href="/my/maps" passHref>
                  <ButtonTextCentered primary size="large" fill label="View Your Maps" />
                </NextLink>
              </Box>
            ) : (
              [
                <Box fill key="log-in-button">
                  <ButtonTextCentered
                    primary
                    size="large"
                    fill
                    label="Log in"
                    onClick={() => {
                      mockSignIn(undefined, { callbackUrl: '/my/maps' });
                    }}
                  />
                </Box>,
                <Box fill key="craft-map-button">
                  <NextLink href="/map" passHref>
                    <ButtonTextCentered primary size="large" fill label="Craft your map" />
                  </NextLink>
                </Box>,
              ]
            )}
          </Box>

          <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
            <Heading level={4} margin={{ top: '0' }}>
              Recenly Created Travelmaps
            </Heading>

            <ErrorBoundary fallback={<Text>Could not fetch recent maps.</Text>}>
              <SuspenseNoSsr
                fallback={
                  <Box animation={{ delay: 2000, type: 'fadeIn' }}>
                    <Text>Loading...</Text>
                  </Box>
                }
              >
                <RecentMapsList />
              </SuspenseNoSsr>
            </ErrorBoundary>
          </Box>
        </Parchment>
      </RelativeBox>
    </>
  );
};

export default Welcome;
