import { Menu as MenuIcon } from 'grommet-icons';
import { Button, Menu } from 'grommet';

const UserMenu: React.FC = () => {
  return (
    <Menu
      items={[
        { label: 'Sign up / Log in', onClick: () => {} },
        { label: 'Settings', onClick: () => {} },
        { label: 'Log out', onClick: () => {} },
      ]}
      dropProps={{ align: { top: 'bottom', right: 'right' } }}
      icon={<MenuIcon size="medium" />}
    />
  );
};

export default UserMenu;
