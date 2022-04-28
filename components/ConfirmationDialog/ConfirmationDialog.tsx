import { Box, Button, Heading, Layer, Text } from 'grommet';

export type ConfirmationDialogProps = {
  open: boolean;
  onCancel: (event: React.SyntheticEvent) => void;
  onRequestClose: (event?: React.SyntheticEvent) => void;
  onConfirm: (event: React.SyntheticEvent, requestClose: () => void) => void;
  confirmButtonLabel: string;
  confirmButtonDisabled?: boolean;
  confirmMessage: string;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onCancel,
  onRequestClose,
  onConfirm,
  confirmButtonLabel,
  confirmButtonDisabled = false,
  confirmMessage,
}) => {
  if (!open) {
    return <></>;
  }
  return (
    <Layer
      background="popup"
      position="center"
      onClickOutside={onRequestClose}
      onEsc={onRequestClose}
      responsive={false}
      margin="large"
    >
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
          <Button secondary label="Cancel" onClick={onCancel} />
          <Button
            label={confirmButtonLabel}
            onClick={(event) => onConfirm(event, onRequestClose)}
            disabled={confirmButtonDisabled}
            primary
            color="status-critical"
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default ConfirmationDialog;
