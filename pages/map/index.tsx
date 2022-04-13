/**
 * New map page
 */
import { createRef, useState } from 'react';
import { Button, Text } from 'grommet';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendCountryList from '../../components/Legend/LegendCountryList';
import CountrySearch from '../../components/CountrySearch';
import LegendActions from '../../components/Legend/LegendActions';
import { mockSignIn } from '../../util/mockUseSession';
import Nav from '../../components/Nav';
import { NextPage } from 'next';

const NewMapPage: NextPage = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const onSave = () => {
    const callbackUrl = `/signUpCallback?countries=${countries.join(',')}`;
    mockSignIn(
      undefined,
      { callbackUrl },
      {
        _newUser: {
          id: `${Math.round(Math.random() * 10000)}`,
          name: 'New User',
          email: `myemail+${Math.round(Math.random() * 10000)}@example.com`,
        },
      }
    );
  };

  const legendRef = createRef<HTMLElement>();

  return (
    <>
      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={[countries]}
        interactive
        applyMapMotion
        animateCamera
      />

      <Nav />

      <Legend ref={legendRef}>
        <LegendTitle heading="Your Travelmap" avatars={undefined} />

        <LegendBody>
          {countries.length === 0 ? (
            <Text color="text-weak">Choose the countries you have visited below and save.</Text>
          ) : (
            <LegendCountryList countries={countries} />
          )}

          <CountrySearch selectedCountries={countries} onCountrySelected={toggleCountry} />

          <LegendActions>
            <Button primary label="Save" disabled={countries.length === 0} onClick={onSave} />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

// export const getServerSideProps = async () => {
//   // @todo: implement functionality to redirect to user's main travelmap if it already exists
//   return { props: {} };
// };

export default NewMapPage;
