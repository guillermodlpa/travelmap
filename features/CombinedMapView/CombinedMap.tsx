import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { createRef, useMemo, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import LegendActions from '../../components/Legend/LegendActions';
import { Button } from 'grommet';
import ShareMap from '../ViewIndividualMap/ShareMap';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';

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

export default function CombinedMap({ travelMap }: { travelMap: ClientCombinedTravelMap }) {
  const legendRef = createRef<HTMLDivElement>();

  const countryListDescriptors = getNonOverlappingListsOfCountries(
    travelMap.individualTravelMaps[0],
    travelMap.individualTravelMaps[1]
  );

  const { user: auth0User } = useUser();
  const isLoggedInUserMap = useMemo(
    () =>
      travelMap.individualTravelMaps.some(
        (travelMap) => travelMap.userId === auth0User?.[CUSTOM_CLAIM_APP_USER_ID]
      ),
    [travelMap, auth0User]
  );

  const [shareMapDialogOpen, setShareMapDialogOpen] = useState<boolean>(false);

  return (
    <>
      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={countryListDescriptors}
        interactive={true}
        countriesCanBeSelected={false}
        applyMapMotion
        animateCamera
      />

      <ShareMap
        open={shareMapDialogOpen}
        onClose={() => setShareMapDialogOpen(false)}
        pathView={travelMap.pathView}
      />

      <Legend ref={legendRef}>
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
                color: 'status-warning',
                label: `Visited countries by both (${countryListDescriptors[0].countries.length})`,
                subItems: countryListDescriptors[0].countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
              {
                id: `combined-${travelMap.individualTravelMaps[0].id}`,
                color: 'status-ok',
                label: `${travelMap.individualTravelMaps[0].userDisplayName} visited countries (${countryListDescriptors[1].countries.length})`,
                subItems: countryListDescriptors[1].countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
              {
                id: `combined-${travelMap.individualTravelMaps[1].id}`,
                color: 'status-critical',
                label: `${travelMap.individualTravelMaps[1].userDisplayName} visited countries (${countryListDescriptors[2].countries.length})`,
                subItems: countryListDescriptors[2].countries.map((country) => ({
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
    </>
  );
}
