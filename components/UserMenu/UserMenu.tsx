import { Menu as MenuIcon } from 'grommet-icons';
import { Box, Menu } from 'grommet';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const MenuContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const UserMenu: React.FC = () => {
  const router = useRouter();
  return (
    <MenuContainer margin="small">
      <Menu
        a11yTitle="User menu"
        items={[
          { label: 'Settings', onClick: () => {} },
          {
            label: 'Log out',
            onClick: () => {
              router.push('/');
            },
          },
        ]}
        dropProps={{ align: { top: 'bottom', right: 'right' } }}
        icon={<MenuIcon color="paper" size="medium" />}
      />
    </MenuContainer>
  );
};

export default UserMenu;
