import { Box, BoxExtendedProps } from 'grommet';

export default function LegendBody({ children, ...props }: BoxExtendedProps) {
  return (
    <Box gap="xsmall" overflow="auto" {...props}>
      {children}
    </Box>
  );
}
