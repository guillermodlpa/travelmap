/**
 * View map page
 */

import { GetServerSideProps } from 'next';
import fixtures from '../../../fixtures';
import { getTravelMapFromCombinedMap } from '../../../util/getTravelMapFunctions';

import ViewMapPage from '../../map/[userId]/index';

export default ViewMapPage;

export const getServerSideProps: GetServerSideProps<
  { travelMap: TravelMap },
  { combinedMapId: string }
> = async (context) => {
  const combinedMapId = context.params?.combinedMapId;
  if (!combinedMapId) {
    return { notFound: true };
  }
  const combinedMap = fixtures.combinedMaps.find((combinedMap) => combinedMap.id === combinedMapId);
  if (!combinedMap) {
    return { notFound: true };
  }
  const travelMap = getTravelMapFromCombinedMap(combinedMap);

  return {
    props: {
      travelMap,
    },
  };
};
