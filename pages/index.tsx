import { Box, Button, Heading, Paragraph, ResponsiveContext, Text } from 'grommet';
import { useContext } from 'react';
import NextLink from 'next/link';
import styled, { useTheme } from 'styled-components';
import StaticMap from '../components/Maps/StaticMap';

const BoxRelative = styled(Box)`
  position: relative;
`;

const ButtonTextCentered = styled(Button)`
  text-align: center;
`;

const Parchment: React.FC = ({ children }) => (
  <BoxRelative pad={{ vertical: 'large', horizontal: 'medium' }} align="center" height="100%">
    <Box background="paper" pad="large" elevation="small" width="large">
      {children}
    </Box>
  </BoxRelative>
);

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Welcome: React.FC = () => {
  console.log(useTheme());
  const size = useContext(ResponsiveContext);
  return (
    <>
      <FullScreenBackground>
        <StaticMap />
      </FullScreenBackground>

      <Parchment>
        <Heading level={2} margin={{ top: '0' }}>
          Welcome, traveler
        </Heading>

        <Box margin={{ vertical: 'large' }}>
          <Paragraph margin={{ top: '0' }} fill size="large">
            “Why do you go away? So that you can come back. So that you can see the place you came
            from with new eyes and extra colors. And the people there see you differently, too.
            Coming back to where you started is not the same as never leaving.”
          </Paragraph>
          <Paragraph fill textAlign="end" margin={{ top: '0' }}>
            ― Terry Pratchett, A Hat Full of Sky
          </Paragraph>
        </Box>

        <Box direction={size === 'small' ? 'column' : 'row'} justify="around" gap="large">
          <Box fill>
            <NextLink href="/map/1" passHref>
              <ButtonTextCentered primary size="large" fill label="Log in" />
            </NextLink>
          </Box>
          <Box fill>
            <NextLink href="/map" passHref>
              <ButtonTextCentered primary size="large" fill label="Craft your map" />
            </NextLink>
          </Box>
        </Box>
      </Parchment>
    </>
  );
};

export default Welcome;
