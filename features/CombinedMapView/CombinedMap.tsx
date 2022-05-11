import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { useContext, useEffect, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import LegendActions from '../../components/Legend/LegendActions';
import { Box, Button, ResponsiveContext, Spinner, Text } from 'grommet';
import ShareMap from '../ViewIndividualMap/ShareMap';
import useCombinedMap from '../../hooks/useCombinedMap';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { useRouter } from 'next/router';
import {
  MAP_HIGHLIGHT_COLOR_1,
  MAP_HIGHLIGHT_COLOR_2,
  MAP_HIGHLIGHT_COLOR_3,
} from '../../util/mapHighlightColors';
import useCanHoverWithEase from '../../hooks/useCanHoverWithEase';
import { ShareOption } from 'grommet-icons';
import HoveredCountryToast from '../EditIndividualMap/HoveredCountryToast';

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

  const [shareMapDialogOpen, setShareMapDialogOpen] = useState<boolean>(false);

  const size = useContext(ResponsiveContext);
  const canHoverWithEase = useCanHoverWithEase();

  const [hoveredCountry, setHoveredCountry] = useState<
    undefined | { code: string; name: string }
  >();

  return (
    <>
      <HeadWithDefaults
        title={travelMap ? `Travelmap - ${getTravelMapName(travelMap)}` : 'Travelmap'}
      />

      {combinedMapId && (
        <HighlightedCountriesMap
          height="100vh"
          id="background-map"
          highlightedCountries={[
            {
              id: `overlap-${combinedMapId}`,
              countries: overlapList,
              color: MAP_HIGHLIGHT_COLOR_3,
            },
            {
              id: `exclusive-${combinedMapId}-1`,
              countries: exclusiveList1,
              color: MAP_HIGHLIGHT_COLOR_1,
            },
            {
              id: `exclusive-${combinedMapId}-2`,
              countries: exclusiveList2,
              color: MAP_HIGHLIGHT_COLOR_2,
            },
          ]}
          zoomCountriesOnLoad
          interactive
          countriesAreInteractive
          showHoveredCountryFill={false}
          onCountryHovered={(param) => setHoveredCountry(param)}
          applyMapMotion
          animateCamera
          initialZoomPadding={size === 'small' ? { bottom: 180, top: 50 } : { bottom: 10, top: 10 }}
        />
      )}

      <HoveredCountryToast hoveredCountry={hoveredCountry} />

      {travelMap && (
        <ShareMap
          open={shareMapDialogOpen}
          onClose={() => setShareMapDialogOpen(false)}
          pathView={travelMap.pathView}
          name={getTravelMapName(travelMap, { includeAppName: true })}
        />
      )}

      {loading && (
        <Legend>
          <Box align="center" margin="small" responsive={false}>
            <Spinner responsive={false} size="medium" />
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
            heading={getTravelMapName(travelMap)}
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
                  color: MAP_HIGHLIGHT_COLOR_3,
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
                  color: MAP_HIGHLIGHT_COLOR_1,
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
                  color: MAP_HIGHLIGHT_COLOR_2,
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
            <Button
              size="medium"
              a11yTitle="Share"
              tip={canHoverWithEase ? 'Share' : undefined}
              icon={<ShareOption size="medium" color="brand" />}
              onClick={() => setShareMapDialogOpen(true)}
            />
          </LegendActions>
        </Legend>
      )}
    </>
  );
}
