import { Box, Button, FormField, Heading, ResponsiveContext, TextInput } from 'grommet';
import { useContext } from 'react';
import NextLink from 'next/link';
import Parchment from '../../components/Parchment';
import { Previous } from 'grommet-icons';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import { useUser } from '@auth0/nextjs-auth0';
import useMyUser from '../../hooks/useMyUser';
import UserSettingsForm from './UserSettingsForm';
import DeleteAccountButton from './DeleteAccountButton';

export default function AccountSettings() {
  const { user: auth0User } = useUser();
  const { data: myUser } = useMyUser();

  const size = useContext(ResponsiveContext);

  return (
    <PrincipalParchmentContainer>
      <Parchment>
        <Box pad="large" gap="large">
          <Box direction="row" align="center" gap="medium" wrap>
            <NextLink passHref href="/my/maps">
              <Button
                a11yTitle="Back to your maps"
                icon={<Previous color="brand" />}
                size="large"
              />
            </NextLink>

            <Box flex>
              <Heading level={2} margin={'0'}>
                {myUser?.displayName ? `${myUser?.displayName}'s Settings` : 'Settings'}
              </Heading>
            </Box>
          </Box>

          <UserSettingsForm />

          <Box border={{ color: 'border', size: '1px', side: 'bottom' }} />

          <Box flex={{ shrink: 0 }} gap="medium" width="medium" alignSelf="center">
            <Heading level={4} margin={'0'}>
              Account
            </Heading>

            <FormField
              label="Email"
              htmlFor="email-input" /* @todo: replace for React 18's useId */
              required
              info="Changing email address hasn't been implemented yet"
            >
              <TextInput
                value={auth0User?.email || ''}
                disabled
                id="email-input"
                readOnly
                onChange={(event) => {}}
              />
            </FormField>

            <DeleteAccountButton />
          </Box>
        </Box>
      </Parchment>
    </PrincipalParchmentContainer>
  );
}
