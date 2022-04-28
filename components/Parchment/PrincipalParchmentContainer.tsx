import { Box, ResponsiveContext } from 'grommet';
import { WidthType } from 'grommet/utils';
import { useContext } from 'react';

export default function PrincipalParchmentContainer({
  width = 'large',
  children,
}: {
  width?: WidthType;
  children: React.ReactNode;
}) {
  const size = useContext(ResponsiveContext);
  return (
    <Box
      style={{ position: 'relative' }}
      align="center"
      margin={{ top: size === 'small' ? 'xlarge' : 'medium' }}
      pad={{ top: 'xlarge', bottom: 'medium', horizontal: 'medium' }}
      animation={['fadeIn', { type: 'slideUp', size: 'xsmall' }]}
    >
      <Box width={width}>{children}</Box>
    </Box>
  );
}
