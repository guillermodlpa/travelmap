import { Button } from 'grommet';
import { Sun, Moon } from 'grommet-icons';
import { useThemeMode } from './ThemeModeContext';

const ThemeModeToggle: React.FC = () => {
  const { mode, setMode } = useThemeMode();
  return (
    <Button
      plain
      onClick={() => {
        setMode((m) => (m === 'light' ? 'dark' : 'light'));
      }}
      tip={mode === 'dark' ? 'Use light color theme' : 'Use dark color theme'}
      icon={
        mode === 'dark' ? (
          <Sun aria-label="Use light color theme" color="text" />
        ) : (
          <Moon aria-label="Use dark color theme" color="text" />
        )
      }
    />
  );
};

export default ThemeModeToggle;
