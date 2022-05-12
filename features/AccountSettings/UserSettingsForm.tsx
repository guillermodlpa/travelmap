import {
  Avatar,
  Box,
  Button,
  FormField,
  Heading,
  ResponsiveContext,
  Text,
  TextInput,
} from 'grommet';
import { Camera } from 'grommet-icons';
import { useContext, useEffect, useState } from 'react';
import useMyUser from '../../hooks/useMyUser';

const isDisplayNameInputValueValid = (displayName: string): boolean =>
  displayName.trim().length > 0;

export default function UserSettingsForm({
  onSaved = () => {},
  showCancelButton = false,
  onCancel = () => {},
}: {
  onSaved?: () => void;
  showCancelButton?: boolean;
  onCancel?: () => void;
}) {
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
  const loadingMyUser = !myUserError && !myUser;
  useEffect(() => {
    if (myUser) {
      setDisplayName(myUser.displayName);
    }
  }, [myUser]);

  const size = useContext(ResponsiveContext);

  const [displayNameInputError, setDisplayNameInputError] = useState<boolean>(false);
  useEffect(() => {
    if (displayNameInputError && isDisplayNameInputValueValid(displayName)) {
      setDisplayNameInputError(false);
    }
  }, [displayName, displayNameInputError]);

  const [saving, setSaving] = useState<boolean>(false);
  const [savingErrorMessage, setSavingErrorMessage] = useState<string>();
  const handleSave = async () => {
    if (!isDisplayNameInputValueValid(displayName)) {
      setDisplayNameInputError(true);
      return;
    }

    setSaving(true);
    setSavingErrorMessage(undefined);

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
          displayName,
        }),
      }).then(() => {
        setSaving(false);
        mutateMyUser();
        onSaved();
      });
    } catch (error) {
      setSaving(false);
      console.error(error);
      setSavingErrorMessage(error instanceof Error ? error.message : 'Error');
    }
  };

  return (
    <Box gap="small" width="medium" alignSelf="center">
      {myUserError && <Text color="status-error">{myUserError.message}</Text>}

      <Box
        direction={size === 'small' ? 'column' : 'row'}
        gap={size === 'small' ? 'medium' : 'large'}
      >
        <Box flex={{ grow: 1 }} margin={{ top: 'large', bottom: 'small' }} gap="medium">
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

                <Button
                  as="div"
                  a11yTitle="Change avatar picture"
                  icon={<Camera color="brand" />}
                  style={{ display: 'flex', justifyContent: 'center' }}
                />

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
                error={displayNameInputError ? 'Invalid' : undefined}
              >
                <TextInput
                  value={displayName}
                  disabled={!Boolean(myUser)}
                  id="display-name-input"
                  maxLength={40}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                  }}
                />
              </FormField>
            </Box>
          </Box>
        </Box>

        {/* could add another column here with more settings */}
      </Box>

      {savingErrorMessage && (
        <Text textAlign="center" color="status-error">
          {savingErrorMessage}
        </Text>
      )}

      <Box direction="row" gap="large" justify="end">
        {showCancelButton && (
          <Button
            secondary
            alignSelf="center"
            label="Cancel"
            disabled={saving}
            onClick={onCancel}
          />
        )}

        <Button
          primary
          label={saving ? 'Saving' : 'Save'}
          disabled={loadingMyUser || saving}
          onClick={handleSave}
        />
      </Box>
    </Box>
  );
}
