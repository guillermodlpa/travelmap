import styled from 'styled-components';
import { Box, Heading } from 'grommet';

const FloatingBox = styled(Box)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
`;

const LogoHeading = styled(Heading)`
  font-family: 'Rye', cursive;
`;

const FloatingLogo: React.FC = () => (
  <FloatingBox background="background-front" pad="small" round="small">
    <LogoHeading margin="none" level={1} size="small" color="brand">
      Travelmap
    </LogoHeading>
  </FloatingBox>
);

export default FloatingLogo;
