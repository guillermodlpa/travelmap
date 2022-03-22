/**
 * New map page
 */
import { createRef, useState } from 'react';
import { Button } from 'grommet';
import StaticMap from '../../components/Maps/StaticMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendCountryList from '../../components/Legend/LegendCountryList';
import CountrySearch from '../../components/CountrySearch';
import LegendActions from '../../components/Legend/LegendActions';
import { InfoNotification } from '../../components/Info';
import { useRouter } from 'next/router';
import { CircleInformation } from 'grommet-icons';
import ThemeModeToggle from '../../components/ThemeModeToggle';

const NewMapPage: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const router = useRouter();
  const onSave = () => {
    router.push(`/auth?countries=${countries.join(',')}`);
  };

  const legendRef = createRef<HTMLDivElement>();

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <ThemeModeToggle />

      <InfoNotification
        relativeRef={legendRef}
        icon={<CircleInformation a11yTitle="Information" />}
        message={`Choose the countries you have visited below and save`}
      />

      <Legend ref={legendRef}>
        <LegendTitle avatarContent="" avatarSrc={undefined} headingText={`Your Travelmap`} />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch disabledCountries={countries} onCountrySelected={toggleCountry} />

          <LegendActions>
            <Button primary label="Save" disabled={countries.length === 0} onClick={onSave} />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export default NewMapPage;
