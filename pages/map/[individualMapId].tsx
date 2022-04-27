import type { GetServerSideProps } from 'next';
import getTravelMapName from '../../util/getTravelMapName';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { formatApiIndividualTravelMapResponse } from '../../util/formatApiResponse';
import { getPrismaClient } from '../../util/prisma';
import MapViewLayout from '../../layouts/MapViewLayout';
import ViewIndividualMap from '../../features/ViewIndividualMap';

export default function ViewIndividualMapPage({
  travelMap,
}: {
  travelMap: ClientIndividualTravelMap;
}) {
  return (
    <>
      <HeadWithDefaults title={`${getTravelMapName(travelMap)}`} />
      <ViewIndividualMap travelMap={travelMap} />
    </>
  );
}

ViewIndividualMapPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

// todo: add caching here, we want these pages to load fast
export const getServerSideProps: GetServerSideProps<
  { travelMap: ClientIndividualTravelMap },
  { individualMapId: string }
> = async (context) => {
  const individualMapId = context.params?.individualMapId;
  if (!individualMapId) {
    return { notFound: true };
  }

  const prisma = getPrismaClient();
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
