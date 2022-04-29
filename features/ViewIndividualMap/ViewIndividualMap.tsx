import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { Button } from 'grommet';
import NextLink from 'next/link';
import { useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import CreateTogetherMapDialog from './CreateTogetherMapDialog';
import ShareMap from './ShareMap';
import LegendActions from '../../components/Legend/LegendActions';

export default function ViewIndividualMap({ travelMap }: { travelMap: ClientIndividualTravelMap }) {
  const { user: auth0User } = useUser();

  const { mapList: togetherMapList } = useUserCombinedMaps({
    shouldFetch: Boolean(auth0User && auth0User?.id !== travelMap.userId),
    otherUserId: travelMap.userId,
  });

  const userCanEditThisMap = auth0User?.[CUSTOM_CLAIM_APP_USER_ID] === travelMap.userId;
  const confirmedUserDoesntHaveTogetherMaps = togetherMapList && togetherMapList.length === 0;
  const confirmedUserHasTogeherMaps = togetherMapList && togetherMapList.length > 0;

  const [createTogetherMapDialogOpen, setCreateTogetherMapDialogOpen] = useState<boolean>(false);
  const [shareMapDialogOpen, setShareMapDialogOpen] = useState<boolean>(false);

  const travelMapName = getTravelMapName(travelMap);

  return (
    <>
      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={[
          {
            id: `individual-${travelMap.id}`,
            countries: travelMap.visitedCountries,
            color: 'status-ok',
          },
        ]}
        interactive
        zoomCountriesOnLoad
        countriesCanBeSelected={false}
        applyMapMotion
        animateCamera
        initialZoomPadding={{ bottom: 250, top: 70 }}
      />

      {confirmedUserDoesntHaveTogetherMaps && (
        <CreateTogetherMapDialog
          open={createTogetherMapDialogOpen}
          onClose={() => setCreateTogetherMapDialogOpen(false)}
          userDisplayName={travelMap.userDisplayName}
          userId={travelMap.userId}
        />
      )}

      <ShareMap
        open={shareMapDialogOpen}
        onClose={() => setShareMapDialogOpen(false)}
        pathView={travelMap.pathView}
        name={travelMapName}
      />

      <Legend>
        <LegendTitle
          heading={travelMapName}
          avatars={[
            {
              id: travelMap.userId,
              name: travelMap.userDisplayName,
              pictureUrl: travelMap.userPictureUrl,
            },
          ]}
        />

        <LegendBody>
          <LegendColorIndicators
            data={[
              {
                id: `individual-${travelMap.id}`,
                color: 'status-ok',
                label: `Visited countries (${travelMap.visitedCountries.length})`,
                subItems: travelMap.visitedCountries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
            ]}
          />
        </LegendBody>

        <LegendActions>
          {userCanEditThisMap ? (
            [
              <Button
                key="share-button"
                label="Share"
                size="small"
                secondary
                onClick={() => setShareMapDialogOpen(true)}
              />,
              <NextLink key="edit-button" href={`/map/edit`} passHref>
                <Button label="Edit" size="small" secondary />
              </NextLink>,
            ]
          ) : confirmedUserDoesntHaveTogetherMaps ? (
            <Button
              size="small"
              label="Create Map Together"
              secondary
              onClick={() => setCreateTogetherMapDialogOpen(true)}
            />
          ) : confirmedUserHasTogeherMaps ? (
            <NextLink href={togetherMapList[0].pathView} passHref>
              <Button label="View Map Together" size="small" secondary />
            </NextLink>
          ) : (
            // render a space so we have the same height as if buttons render, to minimize CLS
            <>{'\u00A0'}</>
          )}
        </LegendActions>
      </Legend>
    </>
  );
}
