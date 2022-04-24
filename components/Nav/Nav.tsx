import { useUser } from '@auth0/nextjs-auth0';
import { Box, Button, ButtonExtendedProps, Nav as GrommetNav } from 'grommet';
import { Globe, Logout, MapLocation, SettingsOption } from 'grommet-icons';
import NextLink from 'next/link';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { PATH_LOG_OUT } from '../../util/paths';
import Parchment from '../Parchment';
import useColorThemeToggle from './useColorThemeToggle';

const NavFloatingBox = styled(GrommetNav)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
`;

const HomeLogoFloatingBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const NavButton = forwardRef<any, ButtonExtendedProps & { icon: JSX.Element; a11yTitle: string }>(
  ({ ...props }, ref) => (
    <Button size="medium" style={{ display: 'flex', alignItems: 'center' }} {...props} ref={ref} />
  )
);
NavButton.displayName = 'NavButton';

const ThemeModeToggleNavButton = () => {
  const { icon, tip, onClick } = useColorThemeToggle();
  return <NavButton a11yTitle={tip} icon={icon} tip={tip} onClick={onClick} />;
};

const Nav: React.FC = () => {
  const { user, isLoading, error } = useUser();
  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <HomeLogoFloatingBox>
        <Parchment contentPad={{ horizontal: 'small', vertical: 'small' }} insetShadowSize="xsmall">
          <NextLink passHref href="/">
            <NavButton
              a11yTitle="Travelmap Landing Page"
              icon={<Globe color="text" />}
              tip="Travelmap Landing Page"
            />
          </NextLink>
        </Parchment>
      </HomeLogoFloatingBox>

      <NavFloatingBox animation="fadeIn">
        <Parchment contentPad={{ horizontal: 'small', vertical: 'small' }} insetShadowSize="xsmall">
          <Box direction="row" gap="xsmall">
            {Boolean(user) && (
              <NextLink passHref href="/my/maps">
                <NavButton a11yTitle="My Maps" icon={<MapLocation color="text" />} tip="My Maps" />
              </NextLink>
            )}

            <ThemeModeToggleNavButton />

            {Boolean(user) && (
              <NextLink passHref href="/my/settings">
                <NavButton
                  a11yTitle="Settings"
                  icon={<SettingsOption color="text" />}
                  tip="Settings"
                />
              </NextLink>
            )}

            {Boolean(user) && (
              <NavButton
                a11yTitle="Log Out"
                tip="Log Out"
                icon={<Logout color="text" />}
                href={PATH_LOG_OUT}
              />
            )}
          </Box>
        </Parchment>
      </NavFloatingBox>
    </>
  );
};

export default Nav;
