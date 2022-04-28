import { SyntheticEvent, useCallback, useState } from 'react';
import ConfirmationDialog, { ConfirmationDialogProps } from './ConfirmationDialog';

type WrappingDialogConfirmationProps = {
  children: (handleClick: (event: SyntheticEvent) => void) => JSX.Element;
} & Omit<ConfirmationDialogProps, 'open' | 'onCancel' | 'onRequestClose'>;

export default function WrappingDialogConfirmation({
  children,
  ...props
}: WrappingDialogConfirmationProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClick = useCallback((event) => {
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
