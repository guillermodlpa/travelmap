import { Box, Heading } from 'grommet';

import CopyToClipboardButton from './CopyToClipboardButton';

const AppHeader: React.FC = () => (
  <Box
    flex={false}
    tag="header"
    direction="row"
    background="white"
    align="center"
    justify="between"
    responsive={false}
    pad={{ horizontal: 'small', vertical: 'medium' }}
  >
    <Heading margin="none" level={1} size="small">
      Travelmap
    </Heading>

    <Box direction="row" align="center" pad={{ horizontal: 'small' }}>
      <CopyToClipboardButton
        primary
        label="Share link"
        labelCopied="Link copied to clipboard!"
        labelError="Error"
      />
    </Box>
  </Box>
);

export default AppHeader;
