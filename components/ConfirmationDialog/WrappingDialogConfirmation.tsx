import { SyntheticEvent, useCallback, useState } from 'react';
import ConfirmationDialog, { ConfirmationDialogProps } from './ConfirmationDialog';

type WrappingDialogConfirmationRenderProps = {
  children: (handleClick: (event: SyntheticEvent) => void) => JSX.Element;
};

const WrappingDialogConfirmation: React.FC<
  Omit<ConfirmationDialogProps, 'open' | 'onCancel'> & WrappingDialogConfirmationRenderProps
> = ({ children, ...props }) => {
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
      />
      {children(handleClick)}
    </>
  );
};

export default WrappingDialogConfirmation;
