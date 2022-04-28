import { Box } from 'grommet';

export default function LegendActions({ children }: { children: React.ReactNode }) {
  return (
    <Box gap="medium" align="end">
      {children}
    </Box>
  );
}
