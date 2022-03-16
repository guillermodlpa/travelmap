/**
 * New map page
 */
import EditMapPage from './[mapSlug]/edit';

const ViewMapPage = EditMapPage;

export default ViewMapPage;

export async function getServerSideProps() {
  return { props: { initialCountries: [], userLoggedIn: false } };
}
