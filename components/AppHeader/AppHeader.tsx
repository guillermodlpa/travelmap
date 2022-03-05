import { Box, Heading, Button } from 'grommet';

const AppHeader: React.FC = () => (
  <Box
    flex={false}
    tag="header"
    direction="row"
    background="white"
    align="center"
    justify="between"
    responsive={false}
    pad="small"
  >
    <Heading margin="none" level={1} size="small">
      Travelmap
    </Heading>

    <Box direction="row" align="center" pad={{ horizontal: 'small' }}>
      <Button primary label="Make your own" />
    </Box>
  </Box>
);

export default AppHeader;
