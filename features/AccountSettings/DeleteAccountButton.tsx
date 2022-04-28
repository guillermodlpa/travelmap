import { Button } from 'grommet';
import { useState } from 'react';
import WrappingDialogConfirmation from '../../components/ConfirmationDialog/WrappingDialogConfirmation';
import useMyUser from '../../hooks/useMyUser';
import { PATH_LOG_OUT } from '../../util/paths';

export default function DeleteAccountButton() {
  const { mutate: mutateMyUser } = useMyUser();

  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const handleDeleteAccount = (requestClose: () => void): Promise<void> => {
    setDeletingAccount(true);
    setErrorMessage(undefined);
    return fetch(`/api/user`, {
      method: 'DELETE',
    })
      .then(() => {
        setTimeout(() => {
          setDeletingAccount(false);
          mutateMyUser();
          requestClose();
          if (typeof window !== 'undefined') {
            window.location.href = PATH_LOG_OUT;
          }
        }, 500);
      })
      .catch((error) => {
        setDeletingAccount(false);
        console.error(error);
        setErrorMessage(error instanceof Error ? error.message : 'Error');
      });
  };

  return (
    <WrappingDialogConfirmation
      onConfirm={(event, requestClose) => {
        handleDeleteAccount(requestClose);
      }}
      confirmButtonLabel={deletingAccount ? 'Deleting Account' : 'Delete Account'}
      confirmButtonDisabled={deletingAccount}
      confirmMessage="Are you sure that you want to delete your account and data?"
      errorMessage={errorMessage}
    >
      {(handleClick) => (
        <Button secondary label="Delete Account" alignSelf="end" onClick={handleClick} />
      )}
    </WrappingDialogConfirmation>
  );
}
