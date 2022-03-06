import { Button, ButtonExtendedProps } from 'grommet';
import { useEffect, useState } from 'react';

const copyTextToClipboard = (text: string) => {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  dummy.setSelectionRange(0, 99999); /* For mobile devices */
  return navigator.clipboard.writeText(dummy.value).then(
    () => {
      document.body.removeChild(dummy);
    },
    (error: Error) => {
      throw error;
    }
  );
};

interface CopyToClipboardButtonProps extends ButtonExtendedProps {
  labelCopied: string;
  labelError: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  label,
  labelCopied,
  labelError,
  ...rest
}) => {
  const [status, setStatus] = useState<'iddle' | 'copied' | 'error'>('iddle');

  useEffect(() => {
    if (status !== 'iddle') {
      const timeout = setTimeout(() => {
        setStatus('iddle');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  return (
    <Button
      {...rest}
      label={
        {
          iddle: label,
          copied: labelCopied || label,
          error: labelError || label,
        }[status]
      }
      color={
        {
          iddle: 'brand',
          copied: 'status-ok',
          error: 'status-error',
        }[status]
      }
      onClick={() => {
        copyTextToClipboard(window.location.href).then(
          () => {
            setStatus('copied');
          },
          () => {
            setStatus('error');
          }
        );
      }}
    />
  );
};

export default CopyToClipboardButton;
