import type { NextPage } from 'next';
import Head from 'next/head';
import { Grommet, Main, Box } from 'grommet';
import Map from '../components/Map/Map';

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
};

const Home: NextPage = () => {
  return (
    <Grommet theme={theme} full="min" themeMode="light">
      <Head>
        <title>Travel map</title>
        <meta name="description" content="To Do" />
      </Head>

      <Main>
        <Box border={{ color: 'gray', size: 'large' }} pad="medium">
          <Box border={{ color: 'brand', size: 'large' }} pad="medium">
            <Map />
          </Box>
        </Box>
      </Main>

      <footer></footer>
    </Grommet>
  );
};

export default Home;
