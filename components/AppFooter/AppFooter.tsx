import { Anchor } from 'grommet';
import ThemeModeButton from './ThemeModeButton';

const AppFooter: React.FC<{
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}> = ({ themeMode, setThemeMode }) => (
  <>
    <Anchor href="https://guillermodelapuente.com" target="_blank">{`About`}</Anchor>
    <ThemeModeButton themeMode={themeMode} setThemeMode={setThemeMode} />
  </>
);

export default AppFooter;
