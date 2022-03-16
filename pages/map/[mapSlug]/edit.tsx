/**
 * Edit map page
 */
import { useState } from 'react';
import { Button } from 'grommet';
import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import CountrySearch from '../../../components/CountrySearch';
import LegendActions from '../../../components/Legend/LegendActions';
import UserMenu from '../../../components/UserMenu';
import { useRouter } from 'next/router';

const EditMapPage: React.FC<{ initialCountries: string[]; userLoggedIn: boolean }> = ({
  initialCountries,
  userLoggedIn,
}) => {
  const [countries, setCountries] = useState<string[]>(initialCountries);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const router = useRouter();
  const onSave = () => {
    router.push('/map/1');
  };

  return (
    <>
      <StaticMap height="100vh" />

      {userLoggedIn && <UserMenu />}

      <Legend>
        <LegendTitle avatarContent="" avatarSrc={undefined} headingText={`Your Travelmap`} />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch disabledCountries={countries} onCountrySelected={toggleCountry} />

          <LegendActions>
            {/* todo: make this button direct to /auth and pass selected maps as query params */}
            <Button primary label="Save" disabled={countries.length === 0} onClick={onSave} />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export async function getServerSideProps() {
  return { props: { initialCountries: ['ESP', 'BLZ', 'MAR', 'MYS'], userLoggedIn: true } };
}

export default EditMapPage;
