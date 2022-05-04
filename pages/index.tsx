import HeadWithDefaults from '../components/HeadWithDefaults';
import Landing from '../features/Landing';
import Nav from '../components/Nav';

export default function Welcome() {
  if (typeof window !== 'undefined') {
    window.onerror = (message) => {
      console.error(`window.onerror`, message);
    };
  }

  return (
    <>
      <HeadWithDefaults title="Travelmap" />
      <Landing />
    </>
  );
}

Welcome.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <Nav />
      {page}
    </>
  );
};

// Static Site Generation (on build time)
export async function getStaticProps() {
  return {
    props: {},
  };
}
