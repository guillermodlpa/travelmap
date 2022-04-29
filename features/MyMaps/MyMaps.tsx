import { Box, Heading, Paragraph, Text } from 'grommet';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import OnboardingBanner from './OnboardingBanner';
import useMyUser from '../../hooks/useMyUser';
import useRedirectUserWithoutDisplayNameToOnboarding from '../../hooks/useRedirectNewUserToEditMap';

export default function MyMaps() {
  const { data: myUser, error: errorWithMyUser } = useMyUser();

  useRedirectUserWithoutDisplayNameToOnboarding();

  return (
    <PrincipalParchmentContainer width="xlarge">
      <Parchment contentBox={{ pad: 'large' }}>
        <Box direction="row" margin={{ bottom: 'medium' }} align="center" gap="medium" wrap>
          <Box flex>
            <Heading level={2} margin={'0'}>
              {myUser?.displayName ? `Welcome ${myUser?.displayName}` : 'Welcome'}
            </Heading>
          </Box>
        </Box>

        <OnboardingBanner />

        {errorWithMyUser && (
          <Text color="status-error">
            Error loading user information: {errorWithMyUser.message}
          </Text>
        )}

        <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
          <Heading level={4}>Your Map</Heading>

          <UserMapList />
        </Box>
        <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
          <Heading level={4}>{`"Together" Maps`}</Heading>

          <CombinedMapsList />

          <Paragraph fill size="small">
            {`Open the Travelmaps of your friends, and click on Create "Together" Map to combine them.`}
          </Paragraph>
        </Box>
      </Parchment>
    </PrincipalParchmentContainer>
  );
}
