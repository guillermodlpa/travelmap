import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import { Anchor, Button, Text } from 'grommet';
import NextLink from 'next/link';
import { createRef, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import { PATH_LOG_IN } from '../../util/paths';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import CreateTogetherMapDialog from './CreateTogetherMapDialog';

export default function ViewIndividualMap({ travelMap }: { travelMap: ClientIndividualTravelMap }) {
  const legendRef = createRef<HTMLDivElement>();

  const { user: auth0User, isLoading } = useUser();

  const { mapList: togetherMapList } = useUserCombinedMaps({
    shouldFetch: Boolean(auth0User && auth0User?.id !== travelMap.userId),
    otherUserId: travelMap.userId,
  });

  const userCanEditThisMap = auth0User?.[CUSTOM_CLAIM_APP_USER_ID] === travelMap.userId;
  const confirmedUserDoesntHaveTogetherMaps = togetherMapList && togetherMapList.length === 0;
  const confirmedUserHasTogeherMaps = togetherMapList && togetherMapList.length > 0;

  const [createTogetherMapDialogOpen, setCreateTogetherMapDialogOpen] = useState<boolean>(false);

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
        interactive={true}
        countriesCanBeSelected={false}
        applyMapMotion
        animateCamera
      />

      {travelMap.type === 'individual' && (
        <CreateTogetherMapDialog
          open={createTogetherMapDialogOpen}
          onClose={() => setCreateTogetherMapDialogOpen(false)}
          userDisplayName={travelMap.userDisplayName}
          userId={travelMap.userId}
        />
      )}

      <Legend ref={legendRef}>
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
                color: 'status-ok',
                label: `Visited countries (${travelMap.visitedCountries.length})`,
                subItems: travelMap.visitedCountries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
            ]}
          />

          <Text textAlign="end">
            {!Boolean(auth0User) && !isLoading ? (
              <NextLink href={PATH_LOG_IN} passHref>
                <Anchor size="small">Log In</Anchor>
              </NextLink>
            ) : userCanEditThisMap ? (
              <NextLink href={`/map/edit`} passHref>
                <Anchor size="small">Edit</Anchor>
              </NextLink>
            ) : confirmedUserDoesntHaveTogetherMaps ? (
              <Button
                size="small"
                label="Create Together Map"
                plain
                color="brand"
                onClick={() => setCreateTogetherMapDialogOpen(true)}
              />
            ) : confirmedUserHasTogeherMaps ? (
              <NextLink href={togetherMapList[0].pathView} passHref>
                <Anchor size="small">View Map Together</Anchor>
              </NextLink>
            ) : undefined}
          </Text>
        </LegendBody>
      </Legend>
    </>
  );
}
