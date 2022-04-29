import { useUser } from '@auth0/nextjs-auth0';
import { Box, Heading, Paragraph, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import RecentMapsList from '../../components/MapList/RecentMapsList';
import Parchment from '../../components/Parchment';
import LandingFooter from './LandingFooter';
import LandingMap from './LandingMap';
import LoginBlock from './LoginBlock';
import QuoteBlock from './QuoteBlock';
import quotes from './quotes';
import ViewMyMapsBlock from './ViewMyMapsBlock';

const LANDING_MAP_HEIGHT = '60vh';

const CONTENT_CONTAINER_WIDTH = 'xlarge';

export default function Landing() {
  const size = useContext(ResponsiveContext);
  const { user: auth0User } = useUser();
  return (
    <>
      <Box height={LANDING_MAP_HEIGHT}>
        <LandingMap height={LANDING_MAP_HEIGHT} />
      </Box>

      <Parchment containerBox={{ margin: { top: '-5px' }, align: 'center' }}>
        <Box
          width={CONTENT_CONTAINER_WIDTH}
          align="center"
          pad={{ top: 'large', bottom: 'small', horizontal: 'large' }}
        >
          {auth0User ? <ViewMyMapsBlock /> : <LoginBlock />}
        </Box>

        <Box
          direction={size === 'small' ? 'column' : 'row'}
          gap="xlarge"
          width={CONTENT_CONTAINER_WIDTH}
          pad={{ top: 'large', horizontal: 'large' }}
          margin={{ bottom: 'large' }}
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

        {!auth0User && (
          <Box
            width={CONTENT_CONTAINER_WIDTH}
            align="center"
            pad={{ bottom: 'xlarge', horizontal: 'large' }}
          >
            <LoginBlock />
          </Box>
        )}
      </Parchment>
      <LandingFooter />
    </>
  );
}
