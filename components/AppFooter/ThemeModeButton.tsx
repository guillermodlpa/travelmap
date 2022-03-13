import { Button } from 'grommet';
import { Sun, Moon } from 'grommet-icons';

const ThemeModeButton: React.FC<{
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}> = ({ themeMode, setThemeMode }) => (
  <Button
    aria-label="Toggle color mode"
    plain
    onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
    style={{ display: 'flex' }}
    size="small"
  >
    <Sun size="small" color={themeMode === 'light' ? 'brand' : undefined} />
    <Moon size="small" color={themeMode === 'dark' ? 'brand' : undefined} />
  </Button>
);

export default ThemeModeButton;
