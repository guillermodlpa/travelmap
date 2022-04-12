import { Box, Button, ButtonExtendedProps, Nav as GrommetNav } from 'grommet';
import { Home, Logout, MapLocation, SettingsOption } from 'grommet-icons';
import NextLink from 'next/link';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { mockSignOut, useMockSession } from '../../util/mockUseSession';
import Parchment from '../Parchment';
import ThemeModeToggle from '../ThemeMode/ThemeModeToggle';

const FloatingBox = styled(GrommetNav)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const NavButton = forwardRef<any, ButtonExtendedProps & { icon: JSX.Element; a11yTitle: string }>(
  ({ ...props }, ref) => (
    <Button size="medium" style={{ display: 'flex', alignItems: 'center' }} {...props} ref={ref} />
  )
);
NavButton.displayName = 'NavButton';

const Nav: React.FC = () => {
  const { status } = useMockSession();

  if (status === 'loading') {
    return <></>;
  }

  return (
    <FloatingBox animation="fadeIn">
      <Parchment contentPad={{ horizontal: 'medium', vertical: 'small' }} insetShadowSize="xsmall">
        <Box direction="row" gap="xsmall">
          {status === 'authenticated' && (
            <NextLink passHref href="/my/maps">
              <NavButton a11yTitle="My Maps" icon={<MapLocation color="text" />} tip="My Maps" />
            </NextLink>
          )}

          {status === 'unauthenticated' && (
            <NextLink passHref href="/">
              <NavButton a11yTitle="Home" icon={<Home color="text" />} tip="Home" />
            </NextLink>
          )}

          <ThemeModeToggle />

          {status === 'authenticated' && (
            <NextLink passHref href="/my/settings">
              <NavButton
                a11yTitle="Settings"
                icon={<SettingsOption color="text" />}
                tip="Settings"
              />
            </NextLink>
          )}

          {status === 'authenticated' && (
            <NavButton
              a11yTitle="Log Out"
              tip="Log Out"
              icon={<Logout color="text" />}
              onClick={() => {
                mockSignOut({ callbackUrl: '/' });
              }}
            />
          )}
        </Box>
      </Parchment>
    </FloatingBox>
  );
};

export default Nav;
