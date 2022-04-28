import { Box, Heading, Layer, Text } from 'grommet';
import UserSettingsForm from '../AccountSettings/UserSettingsForm';

export default function EditDisplayNameDialog({
  open,
  onClose,
  showWelcomeMessage,
  allowUserToClose,
}: {
  open: boolean;
  onClose: () => void;
  showWelcomeMessage: boolean;
  allowUserToClose: boolean;
}) {
  if (!open) {
    return <></>;
  }
  return (
    <Layer
      background="popup"
      position="center"
      onClickOutside={allowUserToClose ? onClose : undefined}
      onEsc={allowUserToClose ? onClose : undefined}
      responsive={false}
      margin="large"
    >
      <Box width="large" pad={{ vertical: 'large', horizontal: 'large' }}>
        {showWelcomeMessage && (
          <>
            <Heading level={2}>{`You're in!`}</Heading>
            <Text>Start by choosing your display name, and other preferences.</Text>
          </>
        )}

        <UserSettingsForm
          onSaved={onClose}
          onCancel={onClose}
          showCancelButton={allowUserToClose}
        />
      </Box>
    </Layer>
  );
}
