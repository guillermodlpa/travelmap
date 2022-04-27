import HeadWithDefaults from '../../components/HeadWithDefaults';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import MapViewLayout from '../../layouts/MapViewLayout';
import EditIndividualMap from '../../features/EditIndividualMap';

function EditMapPage() {
  return (
    <>
      <HeadWithDefaults title="Travelmap - Edit Map" />
      <EditIndividualMap />
    </>
  );
}

type PageWithLayout = typeof EditMapPage & {
  getLayout(page: React.ReactElement): JSX.Element;
};
const EditMapPageWithPageAuthRequired = withPageAuthRequired(EditMapPage) as PageWithLayout;

EditMapPageWithPageAuthRequired.getLayout = function getLayout(page: React.ReactElement) {
  return <MapViewLayout>{page}</MapViewLayout>;
};

export default EditMapPageWithPageAuthRequired;
