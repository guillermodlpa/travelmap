import { Box } from 'grommet';
import styled from 'styled-components';

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

export default Legend;
