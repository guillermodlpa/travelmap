import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Grommet, Main, Box, Text } from 'grommet';
import Map from '../components/Map/Map';
import { useCallback, useEffect, useState } from 'react';
import CountryTags from '../components/CountryTags';
import AppHeader from '../components/AppHeader';
import CountrySearch from '../components/CountrySearch';
import theme from '../util/theme';
import simplifiedWorldAdministrativeBoundaries from '../util/simplified-world-administrative-boundaries.json';
import AppFooter from '../components/AppFooter/AppFooter';

const allCountryCodes = simplifiedWorldAdministrativeBoundaries
  .map(({ iso3 }) => iso3)
  .filter(Boolean) as string[];

const useUpdateUrlWithCountries = (visitedCountries: string[]) => {
  const router = useRouter();
  const countriesQuery = [...visitedCountries].sort((a, b) => a.localeCompare(b)).join('-');
  useEffect(() => {
    router.replace(
      {
        query: countriesQuery !== '' ? { countries: countriesQuery } : null,
      },
      undefined,
      { shallow: true }
    );
  }, [countriesQuery]);
};

const useLoadInitialCountriesFromUrl = (setVisitedCountries: (countries: string[]) => void) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const countryIso3Codes = (urlParams.get('countries') || '').split('-');
    const uniqueCodes = countryIso3Codes.filter(
      (code, index) => countryIso3Codes.indexOf(code) === index
    );
    const filteredCodes = uniqueCodes.filter((code) => allCountryCodes.includes(code));
    if (filteredCodes.length > 0) {
      setVisitedCountries(filteredCodes);
    }
  }, [setVisitedCountries]);
};

const Home: NextPage = () => {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [countryZoomedInto, setCountryZoomedInto] = useState<string>();

  const toggleCountry = useCallback((country: string) => {
    setVisitedCountries((visitedCountries) =>
      visitedCountries.includes(country)
        ? visitedCountries.filter((c) => c !== country)
        : visitedCountries.concat(country)
    );
  }, []);

  useUpdateUrlWithCountries(visitedCountries);
  useLoadInitialCountriesFromUrl(setVisitedCountries);

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  return (
    <Grommet theme={theme} full="min" themeMode={themeMode}>
      <Head>
        <title>Travel map</title>
        <meta name="description" content="To Do" />
      </Head>

      <AppHeader themeMode={themeMode} setThemeMode={setThemeMode} />

      <Main background="background-back" align="center">
        <Box width="100%" height={{ min: '45vh' }}>
          <Map
            visitedCountries={visitedCountries}
            onCountryClicked={toggleCountry}
            countryZoomedInto={countryZoomedInto}
          />
        </Box>

        <Box width="large" pad="medium" direction="row" justify="center" responsive={false}>
          <Box gap="small" align="center">
            <Text size="3xl">{visitedCountries.length}</Text>
            <Text>Countries visited</Text>
          </Box>
        </Box>

        <Box width="large" pad={{ horizontal: 'medium', vertical: 'medium' }} responsive={false}>
          <CountryTags countries={visitedCountries} onSelect={setCountryZoomedInto} />
          <CountrySearch disabledCountries={visitedCountries} onCountrySelected={toggleCountry} />
        </Box>
      </Main>

      <AppFooter />
    </Grommet>
  );
};

export default Home;
