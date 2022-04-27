import { useEffect, useState } from 'react';
import { Box, Button, FormField, Layer, TextInput } from 'grommet';

export default function EditDisplayNameDialog({
  open,
  onClose,
  displayName,
  onDisplayNameChange,
}: {
  open: boolean;
  onClose: () => void;
  displayName: string;
  onDisplayNameChange: (displayName: string) => void;
}) {
  const [currentDisplayName, setCurrentDisplayName] = useState<string>(displayName);
  const [inputError, setInputError] = useState<boolean>(false);
  useEffect(() => {
    if (open) {
      setCurrentDisplayName(displayName);
    }
  }, [open]);
  const handleConfirm = () => {
    const cleanDisplayName = currentDisplayName.trim();
    if (!cleanDisplayName) {
      setInputError(true);
      return;
    }
    onDisplayNameChange(cleanDisplayName);
    onClose();
  };
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
      <Box pad="medium" gap="small" width="medium">
        {/* @todo: use React 18 useId */}
        <FormField
          label="User Display Name"
          htmlFor="user-display-name-input"
          error={inputError ? 'Invalid' : ''}
        >
          <TextInput
            id="user-display-name-input"
            value={currentDisplayName}
            onChange={(event) => setCurrentDisplayName(event.target.value)}
          />
        </FormField>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="Cancel" onClick={onClose} />
          <Button label={'Confirm'} onClick={handleConfirm} primary />
        </Box>
      </Box>
    </Layer>
  );
}
