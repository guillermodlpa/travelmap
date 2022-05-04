import MapViewLayout from '../../layouts/MapViewLayout';
import ViewIndividualMap from '../../features/ViewIndividualMap';
import { useRouter } from 'next/router';

export default function ViewIndividualMapPage() {
  const router = useRouter();
  const individualMapId =
    typeof router.query.individualMapId === 'string' ? router.query.individualMapId : undefined;
  return (
    <>
      <ViewIndividualMap individualMapId={individualMapId} />
    </>
  );
}

ViewIndividualMapPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MapViewLayout>{page}</MapViewLayout>;
};
