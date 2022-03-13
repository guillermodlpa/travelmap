import { Box } from 'grommet';

import ThemeModeButton from './ThemeModeButton';
import CopyToClipboardButton from './CopyToClipboardButton';

const AppHeader: React.FC<{
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}> = ({ themeMode, setThemeMode }) => (
  <Box direction="row" align="center" justify="end" gap="small" flex>
    <ThemeModeButton themeMode={themeMode} setThemeMode={setThemeMode} />
    <CopyToClipboardButton
      primary
      label="Share link"
      labelCopied="Link copied to clipboard!"
      labelError="Error"
    />
  </Box>
);

export default AppHeader;
