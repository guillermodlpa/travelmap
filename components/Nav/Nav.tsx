import { useUser } from '@auth0/nextjs-auth0';
import {
  Avatar,
  Box,
  Button,
  ButtonExtendedProps,
  Nav as GrommetNav,
  ResponsiveContext,
} from 'grommet';
import { Logout, SettingsOption } from 'grommet-icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { forwardRef, useContext } from 'react';
import styled from 'styled-components';
import useCanHoverWithEase from '../../hooks/useCanHoverWithEase';
import useMyUser from '../../hooks/useMyUser';
import { PATH_LOG_OUT } from '../../util/paths';
import Parchment from '../Parchment';
import useColorThemeToggle from './useColorThemeToggle';

const NavFloatingBox = styled(GrommetNav)`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
`;

const HomeLogoFloatingBox = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const NavButton = forwardRef<any, ButtonExtendedProps & { icon: JSX.Element; a11yTitle: string }>(
  ({ ...props }, ref) => (
    <Button size="large" style={{ display: 'flex', alignItems: 'center' }} {...props} ref={ref} />
  )
);
NavButton.displayName = 'NavButton';

const LandingPageButton = styled(Button)`
  font-family: ${({ theme }) => theme.heading.font.family};
  padding-left: ${({ theme }) => theme.button.size.large.pad.vertical};
  padding-right: ${({ theme }) => theme.button.size.large.pad.vertical};
`;

const ThemeModeToggleNavButton = () => {
  const { icon, tip, onClick } = useColorThemeToggle();
  const canHoverWithEase = useCanHoverWithEase();
  return (
    <NavButton
      a11yTitle={tip}
      icon={icon}
      tip={canHoverWithEase ? tip : undefined}
      onClick={onClick}
    />
  );
};

export default function Nav() {
  const { user: auth0User, isLoading, error } = useUser();
  const { data: myUser } = useMyUser();
  const size = useContext(ResponsiveContext);

  const canHoverWithEase = useCanHoverWithEase();

  const router = useRouter();

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <HomeLogoFloatingBox>
        <Parchment
          contentBox={{ pad: { horizontal: 'small', vertical: 'small' } }}
          insetShadowSize="xsmall"
        >
          <NextLink passHref href="/">
            <LandingPageButton
              size="large"
              label={size === 'small' ? '🗺' : '🗺 Travelmap'}
              tip={canHoverWithEase ? 'Landing page' : undefined}
            />
          </NextLink>
        </Parchment>
      </HomeLogoFloatingBox>

      <NavFloatingBox animation="fadeIn">
        <Parchment
          contentBox={{ pad: { horizontal: 'small', vertical: 'small' } }}
          insetShadowSize="xsmall"
        >
          <Box direction="row" gap="xsmall">
            {Boolean(auth0User) && (
              <NextLink passHref href="/my/maps">
                <NavButton
                  a11yTitle="Your Maps"
                  icon={
                    <Avatar
                      margin="none"
                      size="xsmall"
                      background="parchment"
                      border={{ color: 'brand', size: 'xsmall' }}
                      src={myUser?.pictureUrl || undefined}
                    >
                      {(myUser?.displayName || '').substring(0, 1)}
                    </Avatar>
                  }
                  tip={canHoverWithEase ? 'Your Maps' : undefined}
                />
              </NextLink>
            )}

            <ThemeModeToggleNavButton />

            {Boolean(auth0User) && (
              <NextLink passHref href="/my/settings">
                <NavButton
                  a11yTitle="Settings"
                  icon={<SettingsOption color="text" />}
                  tip={canHoverWithEase ? 'Settings' : undefined}
                />
              </NextLink>
            )}

            {Boolean(auth0User) && (
              <NavButton
                a11yTitle="Log Out"
                tip={canHoverWithEase ? 'Log Out' : undefined}
                icon={<Logout color="text" />}
                href={PATH_LOG_OUT}
              />
            )}

            {!Boolean(auth0User) && router.pathname.includes('/map/') && size !== 'small' && (
              <Button
                style={{ display: 'flex', alignItems: 'center' }}
                href={'/'}
                label="What is Travelmap?"
              />
            )}
          </Box>
        </Parchment>
      </NavFloatingBox>
    </>
  );
}
