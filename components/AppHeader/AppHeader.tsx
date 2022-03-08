import { Header, Box, Heading } from 'grommet';

import ThemeModeButton from './ThemeModeButton';
import CopyToClipboardButton from './CopyToClipboardButton';

const AppHeader: React.FC<{
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}> = ({ themeMode, setThemeMode }) => (
  <Header
    flex={false}
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="background-front"
    responsive={false}
    pad={{ horizontal: 'small', vertical: 'medium' }}
  >
    <Heading margin="none" level={1} size="small" color="brand">
      Travelmap
    </Heading>

    <Box direction="row" align="center" pad={{ horizontal: 'small' }}>
      <ThemeModeButton themeMode={themeMode} setThemeMode={setThemeMode} />
      <CopyToClipboardButton
        primary
        label="Share link"
        labelCopied="Link copied to clipboard!"
        labelError="Error"
      />
    </Box>
  </Header>
);

export default AppHeader;
