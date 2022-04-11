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
        onClick={() => {
          setMode((m) => (m === 'light' ? 'dark' : 'light'));
        }}
        icon={
          mode === 'dark' ? (
            <Sun aria-label="Use light color theme" color="text" />
          ) : (
            <Moon aria-label="Use dark color theme" color="text" />
          )
        }
      />
    </FloatingBox>
  );
};

export default ThemeModeToggle;
