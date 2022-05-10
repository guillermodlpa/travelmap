import { Box, Button, Heading, Text } from 'grommet';
import UserMapList from '../../components/MapList/UserMapList';
import CombinedMapsList from '../../components/MapList/CombinedMapsList';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import OnboardingBanner from './OnboardingBanner';
import useMyUser from '../../hooks/useMyUser';
import { Aggregate, CircleInformation } from 'grommet-icons';

export default function MyMaps() {
  const { data: myUser, error: errorWithMyUser } = useMyUser();

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

          <Box direction="row" align="center" gap="xsmall" margin={{ top: 'small' }}>
            <CircleInformation size="medium" />

            <Text size="small">{`To create a map with a friend, first open the link to their map, and then click on the buttton to combine them: `}</Text>
            <Button
              size="medium"
              icon={<Aggregate color="brand" />}
              a11yTitle="Create Map Together"
            />
          </Box>
        </Box>
      </Parchment>
    </PrincipalParchmentContainer>
  );
}
