import styled from 'styled-components';
import { Box, Heading } from 'grommet';

const FloatingBox = styled(Box)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
`;

const FloatingLogo: React.FC = () => (
  <FloatingBox background="background-front" pad="small" round="small">
    <Heading margin="none" level={1} size="small" color="brand">
      Travelmap
    </Heading>
  </FloatingBox>
);

export default FloatingLogo;
