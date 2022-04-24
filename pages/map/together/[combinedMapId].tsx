/**
 * View combined map page
 */

import HighlightedCountriesMap from '../../../components/Maps/HighlightedCountriesMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import { Anchor, Avatar, Box, Text } from 'grommet';
import { PrismaClient } from '@prisma/client';
import NextLink from 'next/link';
import type { GetServerSideProps, NextPage } from 'next';
import { createRef } from 'react';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';
import HeadWithDefaults from '../../../components/HeadWithDefaults';
import { PATH_LOG_IN } from '../../../util/paths';
import { useUser } from '@auth0/nextjs-auth0';
import { formatApiCombinedTravelMapResponse } from '../../../util/formatApiResponse';

const ViewCombinedMapPage: NextPage<{
  travelMap: ClientCombinedTravelMap;
}> = ({ travelMap }) => {
  const legendRef = createRef<HTMLDivElement>();

  const { user, isLoading } = useUser();

  return (
    <>
      <HeadWithDefaults title={`${getTravelMapName(travelMap)}`} />

      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={
          travelMap.individualTravelMaps.map(
            (individualTravelMap) => individualTravelMap.visitedCountries
          ) as [string[], string[]]
        }
        interactive={true}
        applyMapMotion
        animateCamera
      />

      <Nav />

      <Legend ref={legendRef}>
        <LegendTitle heading={getTravelMapName(travelMap)} avatars={[]} />

        <LegendBody>
          {travelMap.individualTravelMaps.map((individualTravelMap) => (
            <Box direction="row" gap="small" align="center" key={individualTravelMap.id}>
              <Box flex={{ shrink: 0 }}>
                <Avatar
                  size="small"
                  background="parchment"
                  border={{ color: 'brand', size: 'small' }}
                  // src={avatarSrc}
                >
                  {individualTravelMap.userDisplayName.substring(0, 1)}
                </Avatar>
              </Box>
              <LegendCountryList
                prefix={`${individualTravelMap.userDisplayName}: `}
                sufix={
                  <>
                    {'. '}
                    <NextLink href={individualTravelMap.pathView} passHref>
                      <Anchor>View</Anchor>
                    </NextLink>
                  </>
                }
                countries={individualTravelMap.visitedCountries}
              />
            </Box>
          ))}

          <Text textAlign="end">
            {!Boolean(user) && !isLoading ? (
              <NextLink href={PATH_LOG_IN} passHref>
                <Anchor>Log In</Anchor>
              </NextLink>
            ) : undefined}
          </Text>
        </LegendBody>
      </Legend>
    </>
  );
};

export default ViewCombinedMapPage;

// todo: add caching here, we want these pages to load fast
export const getServerSideProps: GetServerSideProps<
  { travelMap: ClientCombinedTravelMap },
  { combinedMapId: string }
> = async (context) => {
  const combinedMapId = context.params?.combinedMapId;
  if (!combinedMapId) {
    return { notFound: true };
  }

  const prisma = new PrismaClient();
  const combinedTravelMapResult = await prisma.combinedTravelMap.findFirst({
    where: {
      id: combinedMapId,
    },
    include: {
      users: {
        include: {
          individualTravelMap: true,
        },
      },
    },
  });
  if (!combinedTravelMapResult) {
    return { notFound: true };
  }

  const travelMap = formatApiCombinedTravelMapResponse(combinedTravelMapResult);

  return {
    props: {
      travelMap,
    },
  };
};
