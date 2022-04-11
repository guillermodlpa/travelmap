import { Menu as MenuIcon } from 'grommet-icons';
import { Menu } from 'grommet';
import { mockSignOut, useMockSession } from '../../util/mockUseSession';
import withNoSsr from '../NoSsr/withNoSsr';

const UserMenu: React.FC = () => {
  const { status: authStatus } = useMockSession();

  if (authStatus !== 'authenticated') {
    return <></>;
  }

  return (
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
  );
};

export default withNoSsr(UserMenu);
