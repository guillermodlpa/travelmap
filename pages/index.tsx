import StaticMapBackgroundLayout from '../layouts/StaticMapBackgroundLayout';
import HeadWithDefaults from '../components/HeadWithDefaults';
import Landing from '../features/Landing';

export default function Welcome() {
  return (
    <>
      <HeadWithDefaults title="Travelmap" />
      <Landing />
    </>
  );
}

Welcome.getLayout = function getLayout(page: React.ReactElement) {
  return <StaticMapBackgroundLayout>{page}</StaticMapBackgroundLayout>;
};
