import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { Box, Button, Spinner, Text } from 'grommet';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import CreateTogetherMapDialog from './CreateTogetherMapDialog';
import ShareMap from './ShareMap';
import LegendActions from '../../components/Legend/LegendActions';
import useIndividualMap from '../../hooks/useIndividualMap';
import { useRouter } from 'next/router';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { MAP_HIGHLIGHT_COLOR_1 } from '../../util/mapHighlightColors';
import { Aggregate, Edit, ShareOption } from 'grommet-icons';
import useCanHoverWithEase from '../../hooks/useCanHoverWithEase';

export default function ViewIndividualMap({
  individualMapId,
}: {
  individualMapId: string | undefined;
}) {
  const { user: auth0User } = useUser();
  const router = useRouter();

  const { data: travelMap, error, loading } = useIndividualMap(individualMapId);
  useEffect(() => {
    if (
      (router.isReady && !individualMapId) ||
      (error?.message && /HTTP 404/.test(error.message))
    ) {
      router.replace('/');
    }
  }, [individualMapId, error, router]);

  const { mapList: togetherMapList } = useUserCombinedMaps({
    shouldFetch: Boolean(travelMap && auth0User && auth0User?.id !== travelMap.userId),
    otherUserId: travelMap?.userId,
  });

  const userCanEditThisMap =
    travelMap && auth0User?.[CUSTOM_CLAIM_APP_USER_ID] === travelMap?.userId;
  const confirmedUserDoesntHaveTogetherMaps = togetherMapList && togetherMapList.length === 0;
  const confirmedUserHasTogeherMaps = togetherMapList && togetherMapList.length > 0;

  const [createTogetherMapDialogOpen, setCreateTogetherMapDialogOpen] = useState<boolean>(false);
  const [shareMapDialogOpen, setShareMapDialogOpen] = useState<boolean>(false);

  const canHoverWithEase = useCanHoverWithEase();

  return (
    <>
      <HeadWithDefaults title={`${travelMap ? getTravelMapName(travelMap) : 'Travelmap'}`} />

      {individualMapId && (
        <HighlightedCountriesMap
          height="100vh"
          id="background-map"
          highlightedCountries={[
            {
              id: `individual-${individualMapId}`,
              countries: travelMap?.visitedCountries || [],
              color: MAP_HIGHLIGHT_COLOR_1,
            },
          ]}
          interactive
          zoomCountriesOnLoad
          countriesCanBeSelected={false}
          applyMapMotion
          animateCamera
          initialZoomPadding={{ bottom: 250, top: 70 }}
        />
      )}

      {travelMap && confirmedUserDoesntHaveTogetherMaps && (
        <CreateTogetherMapDialog
          open={createTogetherMapDialogOpen}
          onClose={() => setCreateTogetherMapDialogOpen(false)}
          userDisplayName={travelMap.userDisplayName}
          userId={travelMap.userId}
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

      {error && (
        <Legend>
          <Text size="large" color="status-error">
            Loading error
          </Text>
        </Legend>
      )}

      {loading && (
        <Legend>
          <Box align="center" margin="small" responsive={false}>
            <Spinner responsive={false} size="medium" />
          </Box>
        </Legend>
      )}

      {travelMap && !error && (
        <Legend>
          <LegendTitle
            heading={getTravelMapName(travelMap)}
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
                  color: MAP_HIGHLIGHT_COLOR_1,
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
                <NextLink key="edit-button" href={`/map/edit`} passHref>
                  <Button
                    size="medium"
                    icon={<Edit size="medium" color="brand" />}
                    tip={canHoverWithEase ? 'Edit' : undefined}
                  />
                </NextLink>,
                <Button
                  size="medium"
                  key="share-button"
                  tip={canHoverWithEase ? 'Share' : undefined}
                  icon={<ShareOption size="medium" color="brand" />}
                  onClick={() => setShareMapDialogOpen(true)}
                />,
              ]
            ) : confirmedUserDoesntHaveTogetherMaps ? (
              <Button
                size="medium"
                tip={canHoverWithEase ? 'Create Map Together' : undefined}
                icon={<Aggregate size="medium" color="brand" />}
                onClick={() => setCreateTogetherMapDialogOpen(true)}
              />
            ) : confirmedUserHasTogeherMaps ? (
              <NextLink href={togetherMapList[0].pathView} passHref>
                <Button
                  tip={canHoverWithEase ? 'View Map Together' : undefined}
                  icon={<Aggregate size="medium" color="brand" />}
                  size="medium"
                />
              </NextLink>
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
