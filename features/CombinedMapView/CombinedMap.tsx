import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { useContext, useEffect, useMemo, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import LegendActions from '../../components/Legend/LegendActions';
import { Box, Button, ResponsiveContext, Spinner, Text } from 'grommet';
import ShareMap from '../ViewIndividualMap/ShareMap';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import useCombinedMap from '../../hooks/useCombinedMap';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { useRouter } from 'next/router';

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
  return [overlapList, exclusiveList1, exclusiveList2];
}

export default function CombinedMap({ combinedMapId }: { combinedMapId: string | undefined }) {
  const { data: travelMap, error, loading } = useCombinedMap(combinedMapId);
  const router = useRouter();
  useEffect(() => {
    if ((router.isReady && !combinedMapId) || (error?.message && /HTTP 404/.test(error.message))) {
      router.replace('/');
    }
  }, [combinedMapId, error, router]);

  const [overlapList, exclusiveList1, exclusiveList2] = travelMap
    ? getNonOverlappingListsOfCountries(
        travelMap.individualTravelMaps[0],
        travelMap.individualTravelMaps[1]
      )
    : [[], [], []];

  const { user: auth0User } = useUser();
  const isLoggedInUserMap = useMemo(
    () =>
      (travelMap?.individualTravelMaps || []).some(
        (travelMap) => travelMap.userId === auth0User?.[CUSTOM_CLAIM_APP_USER_ID]
      ),
    [travelMap, auth0User]
  );

  const [shareMapDialogOpen, setShareMapDialogOpen] = useState<boolean>(false);

  const size = useContext(ResponsiveContext);

  return (
    <>
      <HeadWithDefaults title={travelMap ? `${getTravelMapName(travelMap)}` : 'Travelmap'} />

      {combinedMapId && (
        <HighlightedCountriesMap
          height="100vh"
          id="background-map"
          highlightedCountries={[
            {
              id: `overlap-${combinedMapId}`,
              countries: overlapList,
              color: 'status-warning',
            },
            { id: `exclusive-${combinedMapId}-1`, countries: exclusiveList1, color: 'status-ok' },
            {
              id: `exclusive-${combinedMapId}-2`,
              countries: exclusiveList2,
              color: 'status-critical',
            },
          ]}
          zoomCountriesOnLoad
          interactive
          countriesCanBeSelected={false}
          applyMapMotion
          animateCamera
          initialZoomPadding={{ bottom: 250, top: 70 }}
        />
      )}

      {travelMap && (
        <ShareMap
          open={shareMapDialogOpen}
          onClose={() => setShareMapDialogOpen(false)}
          pathView={travelMap.pathView}
          name={getTravelMapName(travelMap)}
        />
      )}

      {loading && (
        <Legend>
          <Box align="center" margin="medium">
            <Spinner size="medium" />
          </Box>
        </Legend>
      )}

      {error && (
        <Legend>
          <Text size="large" color="status-error">
            Loading error
          </Text>
        </Legend>
      )}

      {travelMap && !error && (
        <Legend>
          <LegendTitle
            heading={getTravelMapName(travelMap, { short: size === 'small' })}
            avatars={[
              {
                id: travelMap.individualTravelMaps[0].userId,
                name: travelMap.individualTravelMaps[0].userDisplayName,
                href: travelMap.individualTravelMaps[0].pathView,
                pictureUrl: travelMap.individualTravelMaps[0].userPictureUrl,
              },
              {
                id: travelMap.individualTravelMaps[1].userId,
                name: travelMap.individualTravelMaps[1].userDisplayName,
                href: travelMap.individualTravelMaps[1].pathView,
                pictureUrl: travelMap.individualTravelMaps[1].userPictureUrl,
              },
            ]}
          />

          <LegendBody>
            <LegendColorIndicators
              data={[
                {
                  id: 'both',
                  color: 'status-warning',
                  label:
                    size === 'small'
                      ? `Both (${overlapList.length})`
                      : `Visited countries by both (${overlapList.length})`,
                  subItems: overlapList.map((country) => ({
                    id: country,
                    label: getCountryName(country) || '',
                  })),
                },
                {
                  id: `combined-${travelMap.individualTravelMaps[0].id}`,
                  color: 'status-ok',
                  label:
                    size === 'small'
                      ? `${travelMap.individualTravelMaps[0].userDisplayName} (${exclusiveList1.length})`
                      : `${travelMap.individualTravelMaps[0].userDisplayName} visited countries (${exclusiveList1.length})`,
                  subItems: exclusiveList1.map((country) => ({
                    id: country,
                    label: getCountryName(country) || '',
                  })),
                },
                {
                  id: `combined-${travelMap.individualTravelMaps[1].id}`,
                  color: 'status-critical',
                  label:
                    size === 'small'
                      ? `${travelMap.individualTravelMaps[1].userDisplayName} (${exclusiveList2.length})`
                      : `${travelMap.individualTravelMaps[1].userDisplayName} visited countries (${exclusiveList2.length})`,
                  subItems: exclusiveList2.map((country) => ({
                    id: country,
                    label: getCountryName(country) || '',
                  })),
                },
              ].filter((item) => item.subItems.length > 0)}
            />
          </LegendBody>

          <LegendActions>
            {isLoggedInUserMap ? (
              <Button
                key="share-button"
                label="Share"
                size="small"
                secondary
                onClick={() => setShareMapDialogOpen(true)}
              />
            ) : (
              // render a space so we have the same height as if buttons render, to minimize CLS
              <>{'\u00A0'}</>
            )}
          </LegendActions>
        </Legend>
      )}
    </>
  );
}
