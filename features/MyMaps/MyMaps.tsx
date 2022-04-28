import { Box, Heading, Paragraph, Text } from 'grommet';
import { Suspense, useEffect } from 'react';
import withNoSsr from '../../components/NoSsr/withNoSsr';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import OnboardingBanner from './OnboardingBanner';
import useMyUser from '../../hooks/useMyUser';
import useRedirectUserWithoutDisplayNameToOnboarding from '../../hooks/useRedirectNewUserToEditMap';

const SuspenseNoSsr = withNoSsr(Suspense);

export default function MyMaps() {
  const { data: myUser, error: errorWithMyUser } = useMyUser();

  const errorLoadingUserRecord = Boolean(errorWithMyUser);
  useEffect(() => {
    if (errorLoadingUserRecord) {
      alert('Error loading user record');
    }
  }, [errorLoadingUserRecord]);

  useRedirectUserWithoutDisplayNameToOnboarding();

  return (
    <PrincipalParchmentContainer width="xlarge">
      <Parchment contentPad="large">
        <Box direction="row" margin={{ bottom: 'medium' }} align="center" gap="medium" wrap>
          <Box flex>
            <Heading level={2} margin={'0'}>
              {myUser?.displayName ? `Welcome ${myUser?.displayName}` : 'Welcome'}
            </Heading>
          </Box>
        </Box>

        <OnboardingBanner />

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
  );
}
