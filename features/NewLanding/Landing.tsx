import { Box, Heading, Paragraph, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import RecentMapsList from '../../components/MapList/RecentMapsList';
import Parchment from '../../components/Parchment';
import LandingFooter from './LandingFooter';
import LandingMap from './LandingMap';
import QuoteBlock from './QuoteBlock';
import quotes from './quotes';

const LANDING_MAP_HEIGHT = '60vh';

export default function Landing() {
  const size = useContext(ResponsiveContext);
  return (
    <>
      <Box height={LANDING_MAP_HEIGHT}>
        <LandingMap height={LANDING_MAP_HEIGHT} />
      </Box>

      <Parchment containerBox={{ margin: { top: '-5px' }, align: 'center' }}>
        <Box
          direction={size === 'small' ? 'column' : 'row'}
          gap="xlarge"
          width="xlarge"
          pad={{ top: 'xlarge', horizontal: 'large' }}
          margin={{ bottom: 'xlarge' }}
        >
          <Box>
            <Box margin={{ bottom: 'large' }}>
              <Heading level={3} as="h1" responsive={false} margin="none">
                Welcome to Travelmap
              </Heading>
            </Box>
            <Paragraph fill margin={{ top: 'none' }}>
              A map of the countries you have visited.
            </Paragraph>

            <Paragraph fill margin={{ top: 'none' }}>
              Sign up, create your map, and combine it with the maps of your friends.
            </Paragraph>

            {quotes.map(({ author, content }, index) => (
              <QuoteBlock key={index} author={author} content={content} />
            ))}
          </Box>
          <Box width={size === 'small' ? 'auto' : '40%'} flex={{ shrink: 0 }}>
            <Box margin={{ bottom: 'large' }}>
              <Heading level={3} responsive={false} margin="none">
                Recently Created Travelmaps
              </Heading>
            </Box>
            <RecentMapsList />
          </Box>
        </Box>
      </Parchment>
      <LandingFooter />
    </>
  );
}
