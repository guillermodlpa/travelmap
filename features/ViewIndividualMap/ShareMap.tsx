import { Box, Button, FormField, Layer, TextInput } from 'grommet';
import { Copy, Link } from 'grommet-icons';
import { useState } from 'react';
import ShareButtons from './ShareButtons';

const getUrlHost = (): string => (typeof window !== 'undefined' ? window.location.host : '');

type CopyStatus = 'iddle' | 'copied';

export default function ShareMap({
  open,
  onClose,
  pathView,
  name,
}: {
  open: boolean;
  onClose: () => void;
  pathView: string;
  name: string;
}) {
  const mapUrl = `https://${getUrlHost()}${pathView}`;

  const [copyStatus, setCopyStatus] = useState<CopyStatus>('iddle');
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mapUrl).then(() => {
      setCopyStatus('copied');
      setTimeout(() => {
        setCopyStatus('iddle');
      }, 1000);
    });
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
      margin="small"
    >
      <Box width="large" pad={{ vertical: 'large', horizontal: 'large' }} gap="large">
        <ShareButtons mapUrl={mapUrl} mapName={name} />

        <Box direction="row" gap="small" align="center">
          <FormField label="Shareable URL" htmlFor="share-url-input">
            <TextInput id="share-url-input" readOnly value={mapUrl} size="small" icon={<Link />} />
          </FormField>
          <Button
            icon={<Copy />}
            size="large"
            primary
            a11yTitle="Copy map URL to clipboard"
            tip={
              {
                iddle: 'Copy to clipboard',
                copied: 'Copied',
              }[copyStatus]
            }
            onClick={copyToClipboard}
          />
        </Box>

        <Box as="footer" gap="small" direction="row" align="center" justify="end">
          <Button label="Close" secondary onClick={onClose} />
        </Box>
      </Box>
    </Layer>
  );
}
