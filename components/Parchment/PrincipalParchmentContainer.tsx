import { Box } from 'grommet';

const PrincipalParchmentContainer: React.FC = ({ children }) => (
  <Box
    style={{ position: 'relative' }}
    align="center"
    pad={{ top: 'xlarge', bottom: 'medium', horizontal: 'medium' }}
  >
    <Box width="large">{children}</Box>
  </Box>
);

export default PrincipalParchmentContainer;
