import { Box, Button, Text, Layer, Heading } from 'grommet';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Aggregate } from 'grommet-icons';

export default function CreateTogetherMapDialog({
  open,
  onClose,
  userDisplayName,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userDisplayName: string;
  userId: string;
}) {
  const [creating, setCreating] = useState<boolean>(false);
  const router = useRouter();
  const handleCreate = () => {
    setCreating(true);
    fetch(`/api/combined-maps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otherUserId: userId,
      }),
    })
      .then((response) => response.json())
      .then((responseBody) => {
        setCreating(false);
        const combinedTravelMapPathView = responseBody.pathView;
        router.push(combinedTravelMapPathView);
        onClose();
      })
      .catch((error) => {
        console.error(error);
        setCreating(false);
        alert('error');
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
      margin="large"
    >
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none">
          <Aggregate />
          {` Create "Together" Map`}
        </Heading>
        <Text>
          {`Doing this will make it show for both of you in your list of "Together" Maps.`}
        </Text>
        <Text>{`From your account settings, any of you can delete it later.`}</Text>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="Cancel" onClick={onClose} />
          <Button
            label={creating ? 'Creating' : 'Create "Together" Map'}
            disabled={creating}
            onClick={handleCreate}
            primary
          />
        </Box>
      </Box>
    </Layer>
  );
}
