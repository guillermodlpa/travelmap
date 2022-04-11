import { Box, Button, Heading, Layer, Text } from 'grommet';

export type ConfirmationDialogProps = {
  open: boolean;
  onCancel: (event: React.SyntheticEvent) => void;
  onConfirm: (event: React.SyntheticEvent) => void;
  confirmButtonLabel: string;
  confirmMessage: string;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  confirmButtonLabel,
  confirmMessage,
}) => {
  if (!open) {
    return <></>;
  }
  return (
    <Layer background="popup" position="center" onClickOutside={onCancel} onEsc={onCancel}>
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          Confirm
        </Heading>
        <Text>{confirmMessage}</Text>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="Cancel" onClick={onCancel} />
          <Button label={confirmButtonLabel} onClick={onConfirm} primary color="status-critical" />
        </Box>
      </Box>
    </Layer>
  );
};

export default ConfirmationDialog;
