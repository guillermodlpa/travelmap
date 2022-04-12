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
import { createRef, useEffect, useState } from 'react';
import { getTravelMapFromUser } from '../../../util/getTravelMapFunctions';
import { useMockSession } from '../../../util/mockUseSession';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';
import { FormClose } from 'grommet-icons';
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

  const [togetherMapPromptDimmissed, dismissTogetherMapPrompt] = useState<boolean>(false);
  const validTogetherMapPromptScenario =
    travelMap.type === 'user' &&
    (status === 'authenticated' || status === 'unauthenticated') &&
    data?.user.id !== travelMap.users[0].id;
  const { mapList } = useUserCombinedMaps(
    validTogetherMapPromptScenario ? data!.user.id : null,
    travelMap.users[0].id
  );
  const confirmedUserDoesntHaveTogetherMaps = mapList && mapList.length === 0;

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <Nav />

      {confirmedUserDoesntHaveTogetherMaps && !togetherMapPromptDimmissed && (
        <Legend target={legendRef}>
          <LegendBody>
            <Box direction="row">
              <Text>{`Do you want to create a map of both you and ${travelMap.users[0].name}'s visited countries?`}</Text>
              <Button
                plain
                icon={<FormClose />}
                onClick={() => {
                  dismissTogetherMapPrompt(true);
                }}
              />
            </Box>
          </LegendBody>
          <LegendActions>
            <Button label="Create Travelmap Together" />
          </LegendActions>
        </Legend>
      )}

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
