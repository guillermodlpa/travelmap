import StaticMapBackgroundLayout from '../../layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import AccountSettings from '../../features/AccountSettings';

const AccountSettingsPage = () => {
  return (
    <>
      <HeadWithDefaults title="Travelmap - Settings" />
      <AccountSettings />
    </>
  );
};

type PageWithLayout = typeof AccountSettingsPage & {
  getLayout(page: React.ReactElement): JSX.Element;
};
const AccountSettingsWithPageAuthRequired = withPageAuthRequired(
  AccountSettingsPage
) as PageWithLayout;

AccountSettingsWithPageAuthRequired.getLayout = function getLayout(page: React.ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default AccountSettingsWithPageAuthRequired;
