import styled from 'styled-components';
import { Box, Button } from 'grommet';
import { Sun, Moon } from 'grommet-icons';
import { useThemeMode } from './ThemeModeContext';

const FloatingBox = styled(Box)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
`;

const ThemeModeToggle: React.FC = () => {
  const { mode, setMode } = useThemeMode();
  return (
    <FloatingBox pad="small" round="small">
      <Button
        plain
        color="paper"
        onClick={() => {
          setMode((m) => (m === 'light' ? 'dark' : 'light'));
        }}
      >
        {mode === 'dark' ? <Sun /> : <Moon />}
      </Button>
    </FloatingBox>
  );
};

export default ThemeModeToggle;
