import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Grommet, Main, Box, Footer, Text, Anchor } from 'grommet';
import Map from '../components/Map/Map';
import { useEffect, useState } from 'react';
import CountryTags from '../components/CountryTags';
import AppHeader from '../components/AppHeader';
import CountrySearch from '../components/CountrySearch';
import simplifiedWorldAdministrativeBoundaries from '../constants/simplified-world-administrative-boundaries.json';

const allCountryCodes = simplifiedWorldAdministrativeBoundaries
  .map(({ iso3 }) => iso3)
  .filter(Boolean) as string[];

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: '#228BE6',
    },
  },
  select: {
    options: {
      container: { align: 'start', pad: 'small' },
    },
  },
};

const Home: NextPage = () => {
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [countryZoomedInto, setCountryZoomedInto] = useState<string>();

  const addCountry = (country: string) => {
    setHighlightedCountries(highlightedCountries.concat(country));
  };
  const removeCountry = (country: string) => {
    setHighlightedCountries(highlightedCountries.filter((c) => c !== country));
  };

  const router = useRouter();
  const countriesQuery = [...highlightedCountries].sort((a, b) => a.localeCompare(b)).join('-');
  useEffect(() => {
    console.log('query', countriesQuery !== '' ? { countries: countriesQuery } : null);
    router.replace(
      {
        query: countriesQuery !== '' ? { countries: countriesQuery } : null,
      },
      undefined,
      { shallow: true }
    );
  }, [countriesQuery]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const countryIso3Codes = (urlParams.get('countries') || '').split('-');
    const uniqueCodes = countryIso3Codes.filter(
      (code, index) => countryIso3Codes.indexOf(code) === index
    );
    const filteredCodes = uniqueCodes.filter((code) => allCountryCodes.includes(code));
    if (filteredCodes.length > 0) {
      setHighlightedCountries(filteredCodes);
    }
  }, []);

  return (
    <Grommet theme={theme} full="min" themeMode="light">
      <Head>
        <title>Travel map</title>
        <meta name="description" content="To Do" />
      </Head>

      <AppHeader />

      <Main background={{ color: 'dark-5', opacity: 'weak' }} align="center">
        <Box width="100%" height={{ min: '45vh' }}>
          <Map
            highlightedCountries={highlightedCountries}
            onCountryClicked={(countryAlpha3) => {
              highlightedCountries.includes(countryAlpha3)
                ? removeCountry(countryAlpha3)
                : addCountry(countryAlpha3);
            }}
            countryZoomedInto={countryZoomedInto}
          />
        </Box>

        <Box width="large" pad="medium" direction="row" justify="center" responsive={false}>
          <Box gap="small" align="center">
            <Text size="3xl">{highlightedCountries.length}</Text>
            <Text>Countries visited</Text>
          </Box>
        </Box>

        <Box width="large" pad={{ horizontal: 'medium', vertical: 'medium' }} responsive={false}>
          <CountryTags
            countries={highlightedCountries}
            onSelect={(countryAlpha3) => setCountryZoomedInto(countryAlpha3)}
          />
          <CountrySearch
            disabledCountries={highlightedCountries}
            onCountrySelected={(countryAlpha3) => {
              highlightedCountries.includes(countryAlpha3)
                ? removeCountry(countryAlpha3)
                : addCountry(countryAlpha3);
            }}
          />
        </Box>
      </Main>

      <Footer pad={{ horizontal: 'medium', vertical: 'medium' }} responsive={false}>
        <Anchor
          href="https://guillermodelapuente.com"
          target="_blank"
        >{`Author's website, Guillermo de la Puente`}</Anchor>
      </Footer>
    </Grommet>
  );
};

export default Home;
