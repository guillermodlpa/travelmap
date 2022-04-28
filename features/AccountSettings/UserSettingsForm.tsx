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

  const [displayNameInputError, setDisplayNameInputError] = useState<boolean>(false);
  useEffect(() => {
    if (displayNameInputError && isDisplayNameInputValueValid(displayName)) {
      setDisplayNameInputError(false);
    }
  }, [displayName, displayNameInputError]);

  const [saving, setSaving] = useState<boolean>(false);
  const handleSave = async () => {
    if (!isDisplayNameInputValueValid(displayName)) {
      setDisplayNameInputError(true);
      return;
    }

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
        onSaved();
      });
    } catch (error) {
      setSaving(false);
      console.error(error);
      alert('error');
    }
  };

  return (
    <Box gap="small">
      <Box
        direction={size === 'small' ? 'column' : 'row'}
        gap={size === 'small' ? 'medium' : 'large'}
      >
        <Box
          margin={{ vertical: 'large' }}
          flex={{ grow: size === 'small' ? 0 : 1, shrink: 1 }}
          // width={size === 'small' ? 'auto' : '50%'}
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
                error={displayNameInputError ? 'Invalid' : undefined}
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
          flex={{ grow: size === 'small' ? 0 : 1, shrink: 1 }}
          // width={size === 'small' ? 'auto' : '50%'}
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
      <Box direction="row" gap="large" justify="center">
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
          disabled={isLoadingMyUser || saving}
          onClick={handleSave}
        />
      </Box>
    </Box>
  );
}
