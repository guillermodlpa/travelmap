import { Box, BoxExtendedProps } from 'grommet';

const LegendBody: React.FC<BoxExtendedProps> = ({ children, ...props }) => (
  <Box gap="medium" {...props}>
    {children}
  </Box>
);

export default LegendBody;
