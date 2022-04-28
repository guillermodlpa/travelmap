import StaticMapBackgroundLayout from '../../layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { NextPage } from 'next';
import MyMaps from '../../features/MyMaps';

const UserMapsPage: NextPage = () => {
  return (
    <>
      <HeadWithDefaults title="Travelmap - My Maps" />
      <MyMaps />
    </>
  );
};

type PageWithLayout = typeof UserMapsPage & {
  getLayout(page: React.ReactElement): JSX.Element;
};
const UserMapsWithPageAuthRequired = withPageAuthRequired(UserMapsPage) as PageWithLayout;

UserMapsWithPageAuthRequired.getLayout = function getLayout(page: React.ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};

export default UserMapsWithPageAuthRequired;
