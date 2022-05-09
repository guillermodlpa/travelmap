import { Button } from 'grommet';
import { useState } from 'react';
import WrappingDialogConfirmation from '../../components/ConfirmationDialog/WrappingDialogConfirmation';
import { PATH_LOG_OUT } from '../../util/paths';

export default function DeleteAccountButton() {
  const [deletingState, setDeletingState] = useState<'iddle' | 'deleting' | 'deleted'>('iddle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const handleDeleteAccount = (requestClose: () => void): Promise<void> | void => {
    if (deletingState !== 'iddle') {
      return;
    }
    setDeletingState('deleting');
    setErrorMessage(undefined);
    return fetch(`/api/user`, {
      method: 'DELETE',
    })
      .then(() => {
        setDeletingState('deleted');
        if (typeof window !== 'undefined') {
          window.location.href = PATH_LOG_OUT;
        }
      })
      .catch((error) => {
        setDeletingState('iddle');
        console.error(error);
        setErrorMessage(error instanceof Error ? error.message : 'Error');
      });
  };

  return (
    <WrappingDialogConfirmation
      onConfirm={(event, requestClose) => {
        handleDeleteAccount(requestClose);
      }}
      confirmButtonLabel={
        {
          iddle: 'Delete Account',
          deleting: 'Deleting Account',
          deleted: 'Deleted',
        }[deletingState]
      }
      confirmMessage="Are you sure that you want to delete your account and data?"
      errorMessage={errorMessage}
    >
      {(handleClick) => (
        <Button secondary label="Delete Account" alignSelf="end" onClick={handleClick} />
      )}
    </WrappingDialogConfirmation>
  );
}
