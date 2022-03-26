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
import ThemeModeToggle from '../../../components/ThemeMode/ThemeModeToggle';
import getTravelMapNameForUsers from '../../../util/getTravelMapName';

const ViewMapPage: React.FC<{
  travelMap: TravelMap;
  users: User[];
  isLoggedInUser: boolean;
  userLoggedIn: boolean;
}> = ({ travelMap, users, isLoggedInUser, userLoggedIn }) => {
  const legendRef = createRef<HTMLDivElement>();

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <ThemeModeToggle />

      <UserMenu />

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
          headingText={getTravelMapNameForUsers(users)}
        />

        <LegendBody>
          <LegendCountryList countries={travelMap.countries} />
        </LegendBody>

        <LegendActions>
          {isLoggedInUser && (
            <NextLink href={`/map/${travelMap.id}/edit`} passHref>
              <Button label="Edit" />
            </NextLink>
          )}
        </LegendActions>
      </Legend>
    </>
  );
};

export default ViewMapPage;

export const getServerSideProps: GetServerSideProps<
  { travelMap: TravelMap; users: User[] },
  { map: string }
> = async (context) => {
  const mapSlug = context.params?.map;
  if (!mapSlug) {
    return { notFound: true };
  }
  const travelMap = fixtures.travelMaps.find(({ slug }) => slug === mapSlug);
  if (!travelMap) {
    return { notFound: true };
  }
  const users = fixtures.userTravelMaps
    .filter(({ travelMapId }) => travelMapId === travelMap.id)
    .map(({ userId }) => fixtures.users.find(({ id }) => id === userId))
    .map((user) => user as User);
  return {
    props: {
      travelMap,
      users,
      isLoggedInUser: mapSlug === 'guillermodlpa' ? true : false,
      userLoggedIn: mapSlug === 'guillermodlpa' ? true : false,
    },
  };
};
