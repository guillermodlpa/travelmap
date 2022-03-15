/**
 * New map page
 */
import StaticMap from '../../components/Maps/StaticMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendCountryList from '../../components/Legend/LegendCountryList';
import CountrySearch from '../../components/CountrySearch';
import { useState } from 'react';
import { Box, Button } from 'grommet';

const NewMapPage: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  return (
    <>
      <StaticMap />

      <Legend>
        <LegendTitle avatarContent="" avatarSrc={undefined} headingText={`Your Travelmap`} />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch disabledCountries={countries} onCountrySelected={toggleCountry} />

          <Box justify="end">
            {/* todo: make this button direct to /auth and pass selected maps as query params */}
            <Button primary label="Save" disabled={countries.length === 0} />
          </Box>
        </LegendBody>
      </Legend>
    </>
  );
};

export default NewMapPage;
