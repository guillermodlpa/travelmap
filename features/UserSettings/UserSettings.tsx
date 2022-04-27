import {
  Avatar,
  Box,
  Button,
  CheckBox,
  FormField,
  Heading,
  ResponsiveContext,
  TextInput,
} from 'grommet';
import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Parchment from '../../components/Parchment';
import { Previous } from 'grommet-icons';
import WrappingDialogConfirmation from '../../components/ConfirmationDialog/WrappingDialogConfirmation';
import PrincipalParchmentContainer from '../../components/Parchment/PrincipalParchmentContainer';
import { useUser } from '@auth0/nextjs-auth0';
import useMyUser from '../../hooks/useMyUser';
import { PATH_LOG_OUT } from '../../util/paths';

export default function UserSettings() {
  const { user: auth0User, isLoading: isLoadingAuth0 } = useUser();

  const [notifyOnCombinedMaps, setNotifyOnCombinedMap] = useState<boolean>(false);
  const [notifyOnAppUpdates, setNotifyOnAppUpdates] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File>();

  const [temporaryProfilePictureSrc, setTemporaryProfilePictureSrc] = useState<string>();
  useEffect(() => {
    if (!profilePictureFile) {
      setTemporaryProfilePictureSrc(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePictureFile);
    setTemporaryProfilePictureSrc(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl); // free memory
    };
  }, [profilePictureFile]);

  const { data: myUser, error: myUserError, mutate: mutateMyUser } = useMyUser();
  const isLoadingMyUser = !myUserError && !myUser;
  useEffect(() => {
    if (myUser) {
      setNotifyOnCombinedMap(myUser.notifyOnCombinedMaps);
      setNotifyOnAppUpdates(myUser.notifyOnAppUpdates);
      setDisplayName(myUser.displayName);
    }
  }, [myUser]);

  const size = useContext(ResponsiveContext);

  const [saving, setSaving] = useState<boolean>(false);
  const handleSave = async () => {
    setSaving(true);

    try {
      if (profilePictureFile) {
        const data = new FormData();
        data.append('file', profilePictureFile);
        await fetch(`/api/user/picture`, {
          method: 'POST',
          body: data,
        }).then(() => {
          setProfilePictureFile(undefined);
        });
      }

      await fetch(`/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifyOnCombinedMaps,
          notifyOnAppUpdates,
          displayName,
        }),
      }).then(() => {
        setSaving(false);
        mutateMyUser();
      });
    } catch (error) {
      setSaving(false);
      console.error(error);
      alert('error');
    }
  };

  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const handleDeleteAccount = (): Promise<void> => {
    setDeletingAccount(true);
    return fetch(`/api/user`, {
      method: 'DELETE',
    })
      .then(() => {
        setTimeout(() => {
          setDeletingAccount(false);
          mutateMyUser();
          if (typeof window !== 'undefined') {
            window.location.href = PATH_LOG_OUT;
          }
        }, 500);
      })
      .catch((error) => {
        setDeletingAccount(false);
        console.error(error);
        alert('error');
      });
  };

  return (
    <PrincipalParchmentContainer>
      <Parchment>
        <Box pad="large" gap="large">
          <Box direction="row" align="center" gap="medium" wrap>
            <NextLink passHref href="/my/maps">
              <Button a11yTitle="Back to My Maps" icon={<Previous color="brand" />} />
            </NextLink>

            <Box flex>
              <Heading level={2} margin={'0'}>
                {myUser?.displayName ? `${myUser?.displayName}'s Settings` : 'Settings'}
              </Heading>
            </Box>
          </Box>

          <Box gap="small">
            <Box
              direction={size === 'small' ? 'column' : 'row'}
              gap={size === 'small' ? 'medium' : 'large'}
            >
              <Box
                margin={{ vertical: 'large' }}
                flex={{ shrink: 0 }}
                width={size === 'small' ? 'auto' : '50%'}
                gap="medium"
              >
                <Heading level={4} margin={'0'}>
                  User
                </Heading>

                <Box direction="row" gap="medium">
                  <Box flex={{ shrink: 0 }} margin={{ top: 'small' }}>
                    <label htmlFor="user-picture-file-input" style={{ cursor: 'pointer' }}>
                      <Avatar
                        size="large"
                        background="parchment"
                        border={{ color: 'brand', size: 'small' }}
                        src={temporaryProfilePictureSrc || myUser?.pictureUrl || undefined}
                      >
                        {(displayName || '').substring(0, 1)}
                      </Avatar>
                      <input
                        type="file"
                        id="user-picture-file-input"
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          setProfilePictureFile(event?.target?.files?.[0]);
                        }}
                      />
                    </label>
                  </Box>
                  <Box flex={{ grow: 1, shrink: 1 }}>
                    <FormField
                      label="Display name"
                      htmlFor="display-name-input" /* @todo: replace for React 18's useId */
                      required
                    >
                      <TextInput
                        value={displayName}
                        disabled={!Boolean(myUser)}
                        id="display-name-input"
                        onChange={(event) => {
                          setDisplayName(event.target.value);
                        }}
                      />
                    </FormField>
                  </Box>
                </Box>
              </Box>

              <Box
                margin={{ vertical: 'large' }}
                flex={{ shrink: 0 }}
                width={size === 'small' ? 'auto' : '50%'}
                gap="medium"
              >
                <Heading level={4} margin={'0'}>
                  Notifications
                </Heading>

                <CheckBox
                  checked={notifyOnCombinedMaps}
                  disabled={!Boolean(myUser)}
                  label="When somebody makes a combined map with me"
                  onChange={(event) => {
                    setNotifyOnCombinedMap(event.target.checked);
                  }}
                />

                <CheckBox
                  checked={notifyOnAppUpdates}
                  disabled={!Boolean(myUser)}
                  label="Updates about Travelmap"
                  onChange={(event) => {
                    setNotifyOnAppUpdates(event.target.checked);
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Button
                alignSelf="center"
                label={saving ? 'Saving' : 'Save'}
                disabled={isLoadingAuth0 || isLoadingMyUser || saving}
                onClick={handleSave}
              />
            </Box>
          </Box>

          <Box border={{ color: 'border', size: '1px', side: 'bottom' }} />

          <Box
            flex={{ shrink: 0 }}
            width={size === 'small' ? '100%' : '50%'}
            gap="medium"
            alignSelf="end"
          >
            <Heading level={4} margin={'0'}>
              Account
            </Heading>

            <FormField
              label="Email"
              htmlFor="email-input" /* @todo: replace for React 18's useId */
              required
            >
              <TextInput
                value={auth0User?.email || ''}
                disabled
                id="email-input"
                readOnly
                onChange={(event) => {}}
              />
            </FormField>

            <WrappingDialogConfirmation
              onConfirm={(event, requestClose) => {
                handleDeleteAccount().then(() => {
                  requestClose();
                });
              }}
              confirmButtonLabel={deletingAccount ? 'Deleting Account' : 'Delete Account'}
              confirmButtonDisabled={deletingAccount}
              confirmMessage="Are you sure that you want to delete your account and data?"
            >
              {(handleClick) => (
                <Button
                  label="Delete Account"
                  color="border"
                  alignSelf="end"
                  onClick={handleClick}
                />
              )}
            </WrappingDialogConfirmation>
          </Box>
        </Box>
      </Parchment>
    </PrincipalParchmentContainer>
  );
}
