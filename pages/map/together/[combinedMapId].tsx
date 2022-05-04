import MapViewLayout from '../../../layouts/MapViewLayout';
import CombinedMap from '../../../features/CombinedMapView';
import { useRouter } from 'next/router';

export default function ViewCombinedMapPage() {
  const router = useRouter();
  const combinedMapId =
    typeof router.query.combinedMapId === 'string' ? router.query.combinedMapId : undefined;
  return (
    <>
      <CombinedMap combinedMapId={combinedMapId} />
    </>
  );
}

ViewCombinedMapPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MapViewLayout>{page}</MapViewLayout>;
};
