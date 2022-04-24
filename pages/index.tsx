import { Box, Button, Heading, Paragraph, ResponsiveContext, Text } from 'grommet';
import { useContext, Suspense, ReactElement } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import withNoSsr from '../components/NoSsr/withNoSsr';
import RecentMapsList from '../components/MapList/RecentMapsList';
import ErrorBoundary from '../components/ErrorBoundary';
import Parchment from '../components/Parchment';
import PrincipalParchmentContainer from '../components/Parchment/PrincipalParchmentContainer';
import StaticMapBackgroundLayout from '../components/Layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../components/HeadWithDefaults';
import { PATH_LOG_IN } from '../util/paths';
import { useUser } from '@auth0/nextjs-auth0';

const ButtonTextCentered = styled(Button)`
  text-align: center;
`;

const SuspenseNoSsr = withNoSsr(Suspense);

const Welcome: NextPageWithLayout = () => {
  const size = useContext(ResponsiveContext);

  const { user: auth0User } = useUser();

  return (
    <>
      <HeadWithDefaults title="Travelmap" />
      <PrincipalParchmentContainer>
        <Parchment contentPad="large">
          <Heading level={2} margin={{ top: '0' }}>
            Welcome to Travelmap
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

          <Box
            direction={size === 'small' ? 'column' : 'row'}
            gap="medium"
            flex={{ shrink: 0 }}
            justify="center"
            align="center"
          >
            {Boolean(auth0User) ? (
              <NextLink href="/my/maps" passHref>
                <ButtonTextCentered primary size="large" label="~ View My Maps ~" />
              </NextLink>
            ) : (
              <ButtonTextCentered
                primary
                size="large"
                label="~ Make a Travelmap ~"
                href={PATH_LOG_IN}
              />
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
      </PrincipalParchmentContainer>
    </>
  );
};

Welcome.getLayout = function getLayout(page: ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default Welcome;
