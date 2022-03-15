/**
 * View map page
 */

import { Paragraph } from 'grommet';
import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';

const ViewMapPage: React.FC = () => {
  const countries = ['ESP', 'BLZ', 'MAR', 'MYS'];
  return (
    <>
      <StaticMap />

      <Legend>
        <LegendTitle
          avatarContent="GP"
          avatarSrc={undefined}
          headingText={`Guillermo's Travelmap`}
        />

        <LegendBody>
          <LegendCountryList countries={countries} />
        </LegendBody>
      </Legend>
    </>
  );
};

export default ViewMapPage;
