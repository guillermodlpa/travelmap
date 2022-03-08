import { Button } from 'grommet';
import { Sun, Moon } from 'grommet-icons';

const ThemeModeButton: React.FC<{
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}> = ({ themeMode, setThemeMode }) => (
  <Button
    aria-label="Toggle color mode"
    plain={false}
    onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
    style={{ display: 'flex' }}
  >
    <Sun size="medium" color={themeMode === 'light' ? 'brand' : undefined} />
    <Moon size="medium" color={themeMode === 'dark' ? 'brand' : undefined} />
  </Button>
);

export default ThemeModeButton;
