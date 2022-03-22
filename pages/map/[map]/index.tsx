/**
 * View map page
 */

import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import LegendActions from '../../../components/Legend/LegendActions';
import { Button } from 'grommet';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import UserMenu from '../../../components/UserMenu';
import { InfoNotification } from '../../../components/Info';
import fixtures from '../../../fixtures';
import { createRef } from 'react';

const ViewMapPage: React.FC<{
  userMap: UserMap;
  isLoggedInUser: boolean;
  userLoggedIn: boolean;
}> = ({ userMap, isLoggedInUser, userLoggedIn }) => {
  const legendRef = createRef<HTMLDivElement>();

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      {userLoggedIn && <UserMenu />}

      {!userLoggedIn && (
        <InfoNotification
          icon={null}
          relativeRef={legendRef}
          delay={3000}
          message={`Do you want to have a travelmap?`}
          actions={
            <NextLink href="/map" passHref>
              <Button label="Craft your map" />
            </NextLink>
          }
        />
      )}

      <Legend ref={legendRef}>
        <LegendTitle
          avatarContent="GP"
          avatarSrc={undefined}
          headingText={`${userMap.userDisplayName}'s Travelmap`}
        />

        <LegendBody>
          <LegendCountryList countries={userMap.countries} />
        </LegendBody>

        <LegendActions>
          {isLoggedInUser && (
            <NextLink href={`/map/${userMap.id}/edit`} passHref>
              <Button label="Edit" />
            </NextLink>
          )}
        </LegendActions>
      </Legend>
    </>
  );
};

export default ViewMapPage;

export const getServerSideProps: GetServerSideProps<{ userMap: UserMap }, { map: string }> = async (
  context
) => {
  const mapSlug = context.params?.map;
  if (!mapSlug) {
    return { notFound: true };
  }
  const userMap = fixtures.userMapsBySlug[mapSlug];
  if (!userMap) {
    return { notFound: true };
  }
  return {
    props: {
      userMap,
      isLoggedInUser: mapSlug === 'guillermodlpa' ? true : false,
      userLoggedIn: mapSlug === 'guillermodlpa' ? true : false,
    },
  };
};
