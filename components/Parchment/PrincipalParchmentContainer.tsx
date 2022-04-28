import { Box, ResponsiveContext } from 'grommet';
import { WidthType } from 'grommet/utils';
import { useContext } from 'react';

const PrincipalParchmentContainer: React.FC<{ width?: WidthType }> = ({
  width = 'large',
  children,
}) => {
  const size = useContext(ResponsiveContext);
  return (
    <Box
      style={{ position: 'relative' }}
      align="center"
      responsive={false}
      pad={{ top: 'xlarge', bottom: 'medium', horizontal: size === 'small' ? 'small' : 'medium' }}
      animation={['fadeIn', { type: 'slideUp', size: 'xsmall' }]}
    >
      <Box width={width}>{children}</Box>
    </Box>
  );
};

export default PrincipalParchmentContainer;
