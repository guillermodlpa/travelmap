import { Box, Card, CardBody, CardHeader, Heading } from 'grommet';
import { StatusInfo } from 'grommet-icons';
import useUserMap from '../../hooks/useUserMap';

export default function OnboardingBanner() {
  const { map } = useUserMap();

  if (!map || map.visitedCountries.length > 0) {
    return null;
  }

  return (
    <Card pad="medium" gap="medium" animation="fadeIn">
      <CardHeader gap="small">
        <Box flex={{ shrink: 0 }}>
          <StatusInfo a11yTitle="Information" />
        </Box>
        <Box flex={{ grow: 1 }}>
          <Heading level={4} margin={{ top: '0', bottom: '0' }}>
            Getting started
          </Heading>
        </Box>
      </CardHeader>
      <CardBody>{`Your map of visited countries is empty. Start by clicking on "Edit" below to add visited countries.`}</CardBody>
    </Card>
  );
}
