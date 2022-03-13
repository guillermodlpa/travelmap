import { Avatar, Box, Heading } from 'grommet';

const MapTitle: React.FC = () => (
  <Box align="center" pad={{ horizontal: 'small', vertical: 'medium' }}>
    <Avatar background="brand">Gui</Avatar>
    <Heading level={3}>{`Guillermo's Travelmap`}</Heading>
  </Box>
);

export default MapTitle;
