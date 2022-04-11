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
import { InfoNotification } from '../../../components/Info';
import fixtures from '../../../fixtures';
import { createRef } from 'react';
import { getTravelMapFromUser } from '../../../util/getTravelMapFunctions';
import { useMockSession } from '../../../util/mockUseSession';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';

const ViewMapPage: React.FC<{
  travelMap: TravelMap;
}> = ({ travelMap }) => {
  const legendRef = createRef<HTMLDivElement>();

  const { status, data } = useMockSession();

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <Nav />

      {status === 'unauthenticated' && (
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
          heading={getTravelMapName(travelMap)}
          avatars={travelMap.users.map((user) => ({
            id: user.id,
            name: user.name,
          }))}
        />

        <LegendBody>
          {travelMap.users.map((user) => (
            <LegendCountryList key={user.id} countries={user.visitedCountries} />
          ))}
        </LegendBody>

        <LegendActions>
          {travelMap.type === 'user' &&
            status === 'authenticated' &&
            travelMap.pathEdit &&
            data?.user.id === travelMap.users[0].id && (
              <NextLink href={travelMap.pathEdit} passHref>
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
  { travelMap: TravelMap },
  { userId: string }
> = async (context) => {
  const userId = context.params?.userId;
  if (!userId) {
    return { notFound: true };
  }
  const user = fixtures.users.find((user) => user.id === userId);
  if (!user) {
    return { notFound: true };
  }
  const travelMap = getTravelMapFromUser(user);

  return {
    props: {
      travelMap,
    },
  };
};
