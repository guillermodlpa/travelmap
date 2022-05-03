import { useCallback, useState } from 'react';
import ConfirmationDialog, { ConfirmationDialogProps } from './ConfirmationDialog';

type WrappingDialogConfirmationProps = {
  children: (handleClick: (event: React.SyntheticEvent) => void) => JSX.Element;
} & Omit<ConfirmationDialogProps, 'open' | 'onCancel' | 'onRequestClose'>;

export default function WrappingDialogConfirmation({
  children,
  ...props
}: WrappingDialogConfirmationProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClick = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
    setDialogOpen(true);
  }, []);

  return (
    <>
      <ConfirmationDialog
        {...props}
        open={dialogOpen}
        onCancel={() => {
          setDialogOpen(false);
        }}
        onRequestClose={() => {
          setDialogOpen(false);
        }}
      />
      {children(handleClick)}
    </>
  );
}
