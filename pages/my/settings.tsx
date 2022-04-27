import StaticMapBackgroundLayout from '../../layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import UserSettings from '../../features/UserSettings';

const UserSettingsPage = () => {
  return (
    <>
      <HeadWithDefaults title="Travelmap - Settings" />
      <UserSettings />
    </>
  );
};

type PageWithLayout = typeof UserSettingsPage & {
  getLayout(page: React.ReactElement): JSX.Element;
};
const UserSettingsWithPageAuthRequired = withPageAuthRequired(UserSettingsPage) as PageWithLayout;

UserSettingsWithPageAuthRequired.getLayout = function getLayout(page: React.ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default UserSettingsWithPageAuthRequired;
