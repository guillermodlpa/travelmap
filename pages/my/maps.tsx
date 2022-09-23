import StaticMapBackgroundLayout from '../../layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import type { GetServerSideProps, NextPage } from 'next';
import MyMaps from '../../features/MyMaps';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import { getPrismaClient } from '../../lib/prisma';

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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  if (session) {
    const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];
    const prisma = getPrismaClient();
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { onboarded: true },
    });
    if (user?.onboarded === false) {
      return {
        redirect: {
          destination: '/map/edit?onboarding',
          permanent: false,
        },
      };
    }
  }
  return { props: {} };
};
