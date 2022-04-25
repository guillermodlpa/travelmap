import { Box, Heading, Paragraph, Text } from 'grommet';
import { ReactElement, Suspense, useEffect } from 'react';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import StaticMapBackgroundLayout from '../../components/Layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { NextPage } from 'next';
import useMyUser from '../../hooks/useMyUser';

const SuspenseNoSsr = withNoSsr(Suspense);

const UserMaps: NextPage = () => {
  const { user: auth0User } = useUser();
  const { data: myUser, error: errorWithMyUser } = useMyUser();

  const errorLoadingUserRecord = Boolean(errorWithMyUser);
  useEffect(() => {
    if (errorLoadingUserRecord) {
      alert('Error loading user record');
    }
  }, [errorLoadingUserRecord]);

  return (
    <>
      <HeadWithDefaults title="Travelmap - My Maps" />

      {Boolean(auth0User) && (
        <PrincipalParchmentContainer width="xlarge">
          <Parchment contentPad="large">
            <Box direction="row" margin={{ bottom: 'medium' }} align="center" gap="medium" wrap>
              <Box flex>
                <Heading level={2} margin={'0'}>
                  {myUser?.displayName ? `Welcome ${myUser?.displayName}` : 'Welcome'}
                </Heading>
              </Box>
            </Box>
            TODO: either redirect the new user to the edit map page, or add here an onboarding
            prompt
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
                  <UserMapList />
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
                  <CombinedMapsList />
                </SuspenseNoSsr>
              </ErrorBoundary>

              <Paragraph fill size="small">
                {`Open the Travelmaps of your friends, and click on Create "Together" Map to combine them.`}
              </Paragraph>
            </Box>
          </Parchment>
        </PrincipalParchmentContainer>
      )}
    </>
  );
};

const UserMapsWithPageAuthRequired: NextPageWithLayout = withPageAuthRequired(UserMaps);

UserMapsWithPageAuthRequired.getLayout = function getLayout(page: ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default UserMapsWithPageAuthRequired;
