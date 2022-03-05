import type { NextPage } from 'next';
import Head from 'next/head';
import { Grommet, Main, Box, Avatar, Heading, Text } from 'grommet';
import Map from '../components/Map/Map';
import { useState } from 'react';
import CountryTags from '../components/CountryTags';
import AppHeader from '../components/AppHeader';
import CountrySearch from '../components/CountrySearch';

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

  return (
    <Grommet theme={theme} full="min" themeMode="light">
      <Head>
        <title>Travel map</title>
        <meta name="description" content="To Do" />
      </Head>

      <AppHeader />

      <Main background={{ color: 'dark-5', opacity: 'weak' }} align="center">
        {/* profile and stats */}
        <Box width="large" pad="large" direction="row" justify="between">
          {/* profile */}
          <Box gap="small" align="center">
            <Avatar background="accent-2">:D</Avatar>
            <Box>
              <Text>Anonymous user</Text>
            </Box>
          </Box>

          {/* stats */}
          <Box gap="small" align="center">
            <Text size="3xl">{highlightedCountries.length}</Text>
            <Text>Countries visited</Text>
          </Box>
        </Box>

        {/* map */}
        <Box width="100%" height={{ min: '50vh' }}>
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

        {/* chips */}
        <Box width="large" pad={{ horizontal: 'medium', vertical: 'large' }}>
          <CountryTags
            countries={highlightedCountries}
            onSelect={(countryAlpha3) => setCountryZoomedInto(countryAlpha3)}
            onRemove={(countryAlpha3) => removeCountry(countryAlpha3)}
          />
          <CountrySearch
            disabledCountries={highlightedCountries}
            onCountrySelected={(countryAlpha3) => {
              addCountry(countryAlpha3);
            }}
          />
        </Box>
      </Main>

      <footer></footer>
    </Grommet>
  );
};

export default Home;
