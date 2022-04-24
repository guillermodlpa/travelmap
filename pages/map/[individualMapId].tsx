/**
 * View individual map page
 */

import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendCountryList from '../../components/Legend/LegendCountryList';
import { Anchor, Box, Button, Text, Layer, Heading } from 'grommet';
import { PrismaClient } from '@prisma/client';
import NextLink from 'next/link';
import type { GetServerSideProps, NextPage } from 'next';
import { createRef, useState } from 'react';
import getTravelMapName from '../../util/getTravelMapName';
import Nav from '../../components/Nav';
import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { PATH_LOG_IN } from '../../util/paths';
import { useUser } from '@auth0/nextjs-auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import { useRouter } from 'next/router';
import { formatApiIndividualTravelMapResponse } from '../../util/formatApiResponse';

const CreateTogetherMapDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  userDisplayName: string;
  userId: string;
}> = ({ open, onClose, userDisplayName, userId }) => {
  const [creating, setCreating] = useState<boolean>(false);
  const router = useRouter();
  const handleCreate = () => {
    setCreating(true);
    fetch(`/api/combined-maps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otherUserId: userId,
      }),
    })
      .then((response) => response.json())
      .then((responseBody) => {
        setCreating(false);
        const combinedTravelMapPathView = responseBody.pathView;
        router.push(combinedTravelMapPathView);
        onClose();
      })
      .catch((error) => {
        console.error(error);
        setCreating(false);
        alert('error');
      });
  };
  if (!open) {
    return <></>;
  }
  return (
    <Layer
      background="popup"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      responsive={false}
      margin="large"
    >
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          {`Create "Together" Map`}
        </Heading>
        <Text>
          {`Doing this will make it show for both of you in your list of "Together" Maps.`}
        </Text>
        <Text>{`A notification email will be sent to ${userDisplayName}.`}</Text>
        <Text>{`From your account settings, any of you can delete it later.`}</Text>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="Cancel" onClick={onClose} />
          <Button
            label={creating ? 'Creating' : 'Create "Together" Map'}
            disabled={creating}
            onClick={handleCreate}
            primary
          />
        </Box>
      </Box>
    </Layer>
  );
};

const ViewIndividualMapPage: NextPage<{
  travelMap: ClientIndividualTravelMap;
}> = ({ travelMap }) => {
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
      <HeadWithDefaults title={`${getTravelMapName(travelMap)}`} />

      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={[travelMap.visitedCountries]}
        interactive={true}
        applyMapMotion
        animateCamera
      />

      <Nav />

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
          avatars={[{ id: travelMap.userId, name: travelMap.userDisplayName }]}
        />

        <LegendBody>
          <LegendCountryList countries={travelMap.visitedCountries} />

          <Text textAlign="end">
            {!Boolean(auth0User) && !isLoading ? (
              <NextLink href={PATH_LOG_IN} passHref>
                <Anchor>Log In</Anchor>
              </NextLink>
            ) : userCanEditThisMap ? (
              <NextLink href={`/map/edit`} passHref>
                <Anchor>Edit</Anchor>
              </NextLink>
            ) : confirmedUserDoesntHaveTogetherMaps ? (
              <Button
                label="Create Together Map"
                plain
                color="brand"
                onClick={() => setCreateTogetherMapDialogOpen(true)}
              />
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

export default ViewIndividualMapPage;

// todo: add caching here, we want these pages to load fast
export const getServerSideProps: GetServerSideProps<
  { travelMap: ClientIndividualTravelMap },
  { individualMapId: string }
> = async (context) => {
  const individualMapId = context.params?.individualMapId;
  if (!individualMapId) {
    return { notFound: true };
  }

  const prisma = new PrismaClient();
  const individualTravelMap = await prisma.individualTravelMap.findFirst({
    where: { id: individualMapId },
    include: { user: true },
  });
  if (!individualTravelMap) {
    return { notFound: true };
  }

  const travelMap = formatApiIndividualTravelMapResponse(
    individualTravelMap,
    individualTravelMap.user
  );

  return {
    props: {
      travelMap,
    },
  };
};
