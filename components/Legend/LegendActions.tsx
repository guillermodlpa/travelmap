import { Box, ResponsiveContext } from 'grommet';
import { useContext } from 'react';

export default function LegendActions({ children }: { children: React.ReactNode }) {
  const size = useContext(ResponsiveContext);
  return (
    <Box
      gap="xsmall"
      align="center"
      direction="row"
      justify={size === 'small' ? 'center' : 'end'}
      flex={{ shrink: 0 }}
      margin={{ top: 'small' }}
    >
      {children}
    </Box>
  );
}
