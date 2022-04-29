import { Box, Button } from 'grommet';
import Link from 'next/link';

export default function ViewMyMapsBlock() {
  return (
    <Box direction="row" gap="medium">
      <Link href="/my/maps" passHref>
        <Button size="large" secondary label="View Your Maps" />
      </Link>
    </Box>
  );
}
