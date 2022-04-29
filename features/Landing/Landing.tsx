import { Box, Button, Heading, Paragraph, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import RecentMapsList from '../../components/MapList/RecentMapsList';
import Parchment from '../../components/Parchment';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import { PATH_SIGN_UP, PATH_LOG_IN } from '../../util/paths';
import { useUser } from '@auth0/nextjs-auth0';

const ButtonTextCentered = styled(Button)`
  text-align: center;
`;

export default function Landing() {
  const size = useContext(ResponsiveContext);

  const { user: auth0User } = useUser();

  return (
    <PrincipalParchmentContainer>
      <Parchment contentBox={{ pad: 'large' }}>
        <Heading level={2}>Welcome to Travelmap</Heading>

        <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
          <Paragraph margin={{ top: '0' }} fill size="large">
            “Why do you go away? So that you can come back. So that you can see the place you came
            from with new eyes and extra colors. And the people there see you differently, too.
            Coming back to where you started is not the same as never leaving.”
          </Paragraph>
          <Paragraph fill textAlign="end" margin={{ top: '0' }}>
            ― Terry Pratchett, A Hat Full of Sky
          </Paragraph>
        </Box>

        <Box
          direction={size === 'small' ? 'column' : 'row'}
          gap="medium"
          flex={{ shrink: 0 }}
          justify="center"
          align="center"
        >
          {Boolean(auth0User) ? (
            <NextLink href="/my/maps" passHref>
              <ButtonTextCentered primary size="large" label="View My Maps" />
            </NextLink>
          ) : (
            [
              <ButtonTextCentered
                key="login"
                secondary
                size="large"
                label="Log in"
                href={PATH_LOG_IN}
              />,
              <ButtonTextCentered
                key="signup"
                primary
                size="large"
                label="Create your Travelmap"
                href={PATH_SIGN_UP}
              />,
            ]
          )}
        </Box>

        <Box margin={{ vertical: 'large' }} flex={{ shrink: 0 }}>
          <Heading level={4}>Recenly Created Travelmaps</Heading>

          <RecentMapsList />
        </Box>
      </Parchment>
    </PrincipalParchmentContainer>
  );
}
