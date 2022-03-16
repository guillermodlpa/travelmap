import { Box } from 'grommet';

import UserMenu from '../UserMenu/UserMenu';

const AppHeader: React.FC = () => (
  <Box direction="row" align="center" justify="end" gap="small" flex>
    <UserMenu />
  </Box>
);

export default AppHeader;
