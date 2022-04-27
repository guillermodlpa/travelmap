import { useEffect, useState } from 'react';
import { Box, Button, FormField, Layer, TextInput } from 'grommet';
import UserSettingsForm from '../AccountSettings/UserSettingsForm';

export default function EditDisplayNameDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return <></>;
  }
  return (
    <Layer
      background="popup"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      responsive={false}
      margin="large"
    >
      <Box width="large" pad={{ vertical: 'large', horizontal: 'large' }}>
        <UserSettingsForm onSaved={onClose} />
      </Box>
    </Layer>
  );
}
