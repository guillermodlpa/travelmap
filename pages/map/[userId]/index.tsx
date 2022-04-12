/**
 * View map page
 */

import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import LegendActions from '../../../components/Legend/LegendActions';
import { Anchor, Avatar, Box, Button, Text } from 'grommet';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import fixtures from '../../../fixtures';
import { createRef } from 'react';
import { getTravelMapFromUser } from '../../../util/getTravelMapFunctions';
import { useMockSession } from '../../../util/mockUseSession';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';

const ViewMapPage: React.FC<{
  travelMap: TravelMap;
}> = ({ travelMap }) => {
  const togetherMapRef = createRef<HTMLDivElement>();

  const { status, data } = useMockSession();

  const userCanEditThisMap =
    travelMap.type === 'user' &&
    travelMap.pathEdit &&
    status === 'authenticated' &&
    data?.user.id === travelMap.users[0].id;

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <Nav />

      <Legend target={togetherMapRef}>
        <LegendTitle
          heading={getTravelMapName(travelMap)}
          avatars={
            travelMap.users.length === 1
              ? [{ id: travelMap.users[0].id, name: travelMap.users[0].name }]
              : []
          }
        />

        <LegendBody>
          {travelMap.users.map((user) => (
            <Box direction="row" gap="small" align="center" key={user.id}>
              {travelMap.users.length > 1 && (
                <Box flex={{ shrink: 0 }}>
                  <Avatar
                    size="small"
                    background="parchment"
                    border={{ color: 'brand', size: 'small' }}
                    // src={avatarSrc}
                  >
                    {user.name.substring(0, 1)}
                  </Avatar>
                </Box>
              )}
              <LegendCountryList
                prefix={travelMap.users.length > 1 ? `${user.name}: ` : undefined}
                sufix={
                  userCanEditThisMap ? (
                    <>
                      {'. '}
                      <NextLink href={travelMap.pathEdit!} passHref>
                        <Anchor>Edit</Anchor>
                      </NextLink>
                    </>
                  ) : travelMap.users.length > 1 ? (
                    <>
                      {'. '}
                      <NextLink href={user.pathView} passHref>
                        <Anchor>View</Anchor>
                      </NextLink>
                    </>
                  ) : undefined
                }
                countries={user.visitedCountries}
              />
            </Box>
          ))}
        </LegendBody>

        {/* <LegendActions>
          {travelMap.type === 'user' &&
            status === 'authenticated' &&
            travelMap.pathEdit &&
            data?.user.id === travelMap.users[0].id && (
              <NextLink href={travelMap.pathEdit} passHref>
                <Button label="Edit" />
              </NextLink>
            )}
        </LegendActions> */}
      </Legend>

      {travelMap.type === 'user' &&
        (status === 'authenticated' || status === 'unauthenticated') &&
        data?.user.id !== travelMap.users[0].id && (
          <Legend ref={togetherMapRef}>
            <LegendBody>
              <Text>{`Do you want to create a map of both you and ${travelMap.users[0].name}'s visited countries?`}</Text>
            </LegendBody>
            <LegendActions>
              <Button label="Create Travelmap Together" />
            </LegendActions>
          </Legend>
        )}
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
