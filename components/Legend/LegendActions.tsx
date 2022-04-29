import { Box } from 'grommet';

export default function LegendActions({ children }: { children: React.ReactNode }) {
  return (
    <Box
      gap="xsmall"
      align="center"
      direction="row"
      justify="end"
      flex={{ shrink: 0 }}
      margin={{ top: 'small' }}
    >
      {children}
    </Box>
  );
}
