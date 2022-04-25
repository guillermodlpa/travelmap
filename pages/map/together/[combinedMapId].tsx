/**
 * View combined map page
 */

import HighlightedCountriesMap from '../../../components/Maps/HighlightedCountriesMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import type { GetServerSideProps, NextPage } from 'next';
import { createRef } from 'react';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';
import HeadWithDefaults from '../../../components/HeadWithDefaults';
import { formatApiCombinedTravelMapResponse } from '../../../util/formatApiResponse';
import LegendColorIndicators from '../../../components/Legend/LegendColorIndicators';
import getCountryName from '../../../util/getCountryName';
import { getPrismaClient } from '../../../util/prisma';

function arrayExclude<T>(array1: T[], array2: T[]): T[] {
  return (array1 || []).filter((value) => !(array2 || []).includes(value));
}
function arrayIntersect<T>(array1: T[], array2: T[]): T[] {
  return (array1 || []).filter((value) => (array2 || []).includes(value));
}
function getNonOverlappingListsOfCountries(
  travelMap1: ClientIndividualTravelMap,
  travelMap2: ClientIndividualTravelMap
) {
  const exclusiveList1 = arrayExclude(travelMap1.visitedCountries, travelMap2.visitedCountries);
  const exclusiveList2 = arrayExclude(travelMap2.visitedCountries, travelMap1.visitedCountries);
  const overlapList = arrayIntersect(travelMap1.visitedCountries, travelMap2.visitedCountries);
  return [
    {
      id: `overlap-${travelMap1.id}-${travelMap2.id}`,
      countries: overlapList,
      color: 'status-warning',
    },
    { id: `exclusive-${travelMap1.id}`, countries: exclusiveList1, color: 'status-ok' },
    { id: `exclusive-${travelMap2.id}`, countries: exclusiveList2, color: 'status-critical' },
  ];
}

const ViewCombinedMapPage: NextPage<{
  travelMap: ClientCombinedTravelMap;
}> = ({ travelMap }) => {
  const legendRef = createRef<HTMLDivElement>();

  const highlightedCountriesDescriptors = getNonOverlappingListsOfCountries(
    travelMap.individualTravelMaps[0],
    travelMap.individualTravelMaps[1]
  );

  return (
    <>
      <HeadWithDefaults title={`${getTravelMapName(travelMap)}`} />

      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={highlightedCountriesDescriptors}
        interactive={true}
        countriesInteractive={false}
        applyMapMotion
        animateCamera
      />

      <Nav />

      <Legend ref={legendRef}>
        <LegendTitle
          heading={getTravelMapName(travelMap)}
          avatars={[
            {
              id: travelMap.individualTravelMaps[0].userId,
              name: travelMap.individualTravelMaps[0].userDisplayName,
              href: travelMap.individualTravelMaps[0].pathView,
            },
            {
              id: travelMap.individualTravelMaps[1].userId,
              name: travelMap.individualTravelMaps[1].userDisplayName,
              href: travelMap.individualTravelMaps[1].pathView,
            },
          ]}
        />

        <LegendBody>
          <LegendColorIndicators
            data={[
              {
                id: 'both',
                color: 'status-warning',
                label: `Visited countries by both`,
                subItems: highlightedCountriesDescriptors[0].countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
              {
                id: `combined-${travelMap.individualTravelMaps[0].id}`,
                color: 'status-ok',
                label: `${travelMap.individualTravelMaps[0].userDisplayName} visited countries`,
                subItems: highlightedCountriesDescriptors[1].countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
              {
                id: `combined-${travelMap.individualTravelMaps[1].id}`,
                color: 'status-critical',
                label: `${travelMap.individualTravelMaps[1].userDisplayName} visited countries`,
                subItems: highlightedCountriesDescriptors[2].countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
            ]}
          />
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

  const prisma = getPrismaClient();
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
