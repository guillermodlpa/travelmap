import { Sun, Moon } from 'grommet-icons';
import { useThemeMode } from '../ThemeModeContext';

const useColorThemeToggle = () => {
  const { mode, setMode } = useThemeMode();

  return {
    icon:
      mode === 'dark' ? (
        <Sun aria-label="Use light color theme" color="text" />
      ) : (
        <Moon aria-label="Use dark color theme" color="text" />
      ),
    tip: mode === 'dark' ? 'Use light color theme' : 'Use dark color theme',
    onClick: () => {
      setMode((m: 'light' | 'dark' | undefined) => (m === 'light' ? 'dark' : 'light'));
    },
  };
};

export default useColorThemeToggle;
