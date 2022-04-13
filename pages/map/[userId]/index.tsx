/**
 * View map page
 */

import HighlightedCountriesMap from '../../../components/Maps/HighlightedCountriesMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import LegendActions from '../../../components/Legend/LegendActions';
import { Anchor, Avatar, Box, Button, Text } from 'grommet';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import fixtures from '../../../fixtures';
import { createRef, useEffect, useState } from 'react';
import { getTravelMapFromUser } from '../../../util/getTravelMapFunctions';
import { useMockSession } from '../../../util/mockUseSession';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';
import useUserCombinedMaps from '../../../hooks/useUserCombinedMaps';

const ViewMapPage: React.FC<{
  travelMap: TravelMap;
}> = ({ travelMap }) => {
  const legendRef = createRef<HTMLDivElement>();

  const { status, data } = useMockSession();

  const userCanEditThisMap =
    travelMap.type === 'user' &&
    travelMap.pathEdit &&
    status === 'authenticated' &&
    data?.user.id === travelMap.users[0].id;

  const shouldFetchCombinedMaps =
    travelMap.type === 'user' &&
    status === 'authenticated' &&
    data?.user.id !== travelMap.users[0].id;
  const { mapList: togetherMapList } = useUserCombinedMaps(
    shouldFetchCombinedMaps ? data!.user.id : null,
    travelMap.users[0].id
  );
  const confirmedUserDoesntHaveTogetherMaps = togetherMapList && togetherMapList.length === 0;
  const confirmedUserHasTogeherMaps = togetherMapList && togetherMapList.length > 0;

  return (
    <>
      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={
          travelMap.users.map((user) => user.visitedCountries) as [string[], string[]]
        }
        interactive={true}
      />

      <Nav />

      <Legend ref={legendRef}>
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
                  travelMap.users.length > 1 ? (
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

          <Text textAlign="end">
            {status === 'unauthenticated' ? (
              <Anchor>Log In</Anchor>
            ) : userCanEditThisMap ? (
              <NextLink href={travelMap.pathEdit!} passHref>
                <Anchor>Edit</Anchor>
              </NextLink>
            ) : confirmedUserDoesntHaveTogetherMaps ? (
              <NextLink href={'#todo'} passHref>
                <Anchor>Create Together Map</Anchor>
              </NextLink>
            ) : confirmedUserHasTogeherMaps ? (
              <NextLink href={togetherMapList[0].pathView} passHref>
                <Anchor>View Together Map</Anchor>
              </NextLink>
            ) : undefined}
          </Text>
        </LegendBody>
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
