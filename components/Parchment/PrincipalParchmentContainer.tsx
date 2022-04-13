import { Box } from 'grommet';
import { WidthType } from 'grommet/utils';

const PrincipalParchmentContainer: React.FC<{ width?: WidthType }> = ({
  width = 'large',
  children,
}) => (
  <Box
    style={{ position: 'relative' }}
    align="center"
    pad={{ top: 'xlarge', bottom: 'medium', horizontal: 'medium' }}
  >
    <Box width={width}>{children}</Box>
  </Box>
);

export default PrincipalParchmentContainer;
