/**
 * View map page
 */

import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import LegendActions from '../../../components/Legend/LegendActions';
import { Button } from 'grommet';
import NextLink from 'next/link';

const ViewMapPage: React.FC<{ countries: string[] }> = ({ countries }) => {
  return (
    <>
      <StaticMap height="100vh" />

      <Legend>
        <LegendTitle
          avatarContent="GP"
          avatarSrc={undefined}
          headingText={`Guillermo's Travelmap`}
        />

        <LegendBody>
          <LegendCountryList countries={countries} />
        </LegendBody>

        <LegendActions>
          <NextLink href="/map/1/edit" passHref>
            <Button label="Edit" />
          </NextLink>
        </LegendActions>
      </Legend>
    </>
  );
};

export default ViewMapPage;

export async function getServerSideProps() {
  return { props: { countries: ['ESP', 'BLZ', 'MAR', 'MYS'] } };
}
