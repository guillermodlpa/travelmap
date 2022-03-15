import { Anchor } from 'grommet';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import ThemeModeButton from './ThemeModeButton';

const AppFooter: React.FC = () => {
  const { mode, setMode } = useThemeMode();

  return (
    <>
      <Anchor href="https://guillermodelapuente.com" target="_blank">{`About`}</Anchor>
      <ThemeModeButton themeMode={mode} setThemeMode={setMode} />
    </>
  );
};

export default AppFooter;
