import { Button, ButtonExtendedProps, Nav as GrommetNav } from 'grommet';
import { Home, Logout, MapLocation, SettingsOption } from 'grommet-icons';
import NextLink from 'next/link';
import styled from 'styled-components';
import { mockSignOut, useMockSession } from '../../util/mockUseSession';
import ThemeModeToggle from '../ThemeMode/ThemeModeToggle';

const FloatingBox = styled(GrommetNav)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;

  &:hover {
    background-color: ${({ theme }) =>
      theme.global.colors.parchment[theme.dark ? 'dark' : 'light']}80;
  }
`;

const NavButton: React.FC<ButtonExtendedProps & { icon: JSX.Element; a11yTitle: string }> = ({
  ...props
}) => <Button plain style={{ display: 'flex', alignItems: 'center' }} {...props} />;

const Nav: React.FC = () => {
  const { status } = useMockSession();

  if (status === 'loading') {
    return <></>;
  }

  return (
    <FloatingBox
      direction="row"
      pad={{ horizontal: 'medium', vertical: 'small' }}
      animation="fadeIn"
    >
      {status === 'authenticated' && (
        <NextLink passHref href="/my/maps">
          <NavButton a11yTitle="My Maps" icon={<MapLocation color="text" />} />
        </NextLink>
      )}

      {status === 'unauthenticated' && (
        <NextLink passHref href="/">
          <NavButton a11yTitle="Home" icon={<Home color="text" />} />
        </NextLink>
      )}

      <ThemeModeToggle />

      {status === 'authenticated' && (
        <NextLink passHref href="/my/settings">
          <NavButton a11yTitle="Settings" icon={<SettingsOption color="text" />} />
        </NextLink>
      )}

      {status === 'authenticated' && (
        <NavButton
          a11yTitle="Log Out"
          icon={<Logout color="text" />}
          onClick={() => {
            mockSignOut({ callbackUrl: '/' });
          }}
        />
      )}
    </FloatingBox>
  );
};

export default Nav;
