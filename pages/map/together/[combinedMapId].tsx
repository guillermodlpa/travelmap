import type { GetServerSideProps } from 'next';
import getTravelMapName from '../../../util/getTravelMapName';
import HeadWithDefaults from '../../../components/HeadWithDefaults';
import { formatApiCombinedTravelMapResponse } from '../../../util/formatApiResponse';
import { getPrismaClient } from '../../../util/prisma';
import MapViewLayout from '../../../layouts/MapViewLayout';
import CombinedMap from '../../../features/CombinedMapView';

export default function ViewCombinedMapPage({ travelMap }: { travelMap: ClientCombinedTravelMap }) {
  return (
    <>
      <HeadWithDefaults title={`${getTravelMapName(travelMap)}`} />
      <CombinedMap travelMap={travelMap} />
    </>
  );
}

ViewCombinedMapPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

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
