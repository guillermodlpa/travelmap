/**
 * View map page
 */

import { Box, Avatar, Heading, Text } from 'grommet';
import styled from 'styled-components';
import StaticMap from '../../../components/Maps/StaticMap';

const Legend = styled(Box).attrs({
  background: 'paper',
  pad: 'medium',
  elevation: 'small',
})`
  position: absolute;
  bottom: 2rem;
  right: 1rem;
  z-index: 1;
  width: 450px;
  max-width: 50%;
`;

const LegendTitle: React.FC = ({ children }) => (
  <Box direction="row" margin={{ bottom: 'medium' }} align="end" gap="small" wrap>
    {children}
  </Box>
);
const LegendBody: React.FC = ({ children }) => <Box>{children}</Box>;

const ViewMapPage: React.FC = () => {
  return (
    <>
      <StaticMap />

      <Legend>
        <LegendTitle>
          <Avatar border={{ color: 'white', size: 'small' }} size="medium">
            GP
          </Avatar>
          <Box border={{ color: 'white', size: 'small', side: 'bottom' }} flex>
            <Heading level={1} size="small">{`Guillermo's Travelmap`}</Heading>
          </Box>
        </LegendTitle>

        <LegendBody>
          <Text>Spain, Portugal, France, Italy, United Kingdom, Norway, Russia, Yemen, Brazil</Text>
        </LegendBody>
      </Legend>
    </>
  );
};

export default ViewMapPage;
