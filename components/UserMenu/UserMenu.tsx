import { Menu as MenuIcon } from 'grommet-icons';
import { Box, Menu } from 'grommet';
import styled from 'styled-components';
import { mockSignOut, useMockSession } from '../../util/mockUseSession';
import withNoSsr from '../NoSsr/withNoSsr';

const MenuContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const UserMenu: React.FC = () => {
  const { status: authStatus } = useMockSession();

  if (authStatus !== 'authenticated') {
    return <></>;
  }

  return (
    <MenuContainer margin="small">
      <Menu
        a11yTitle="User menu"
        items={[
          { label: 'Settings', onClick: () => {} },
          {
            label: 'Log out',
            onClick: () => {
              mockSignOut({ callbackUrl: '/' });
            },
          },
        ]}
        dropProps={{ align: { top: 'bottom', right: 'right' } }}
        icon={<MenuIcon color="text" size="medium" />}
      />
    </MenuContainer>
  );
};

export default withNoSsr(UserMenu);
