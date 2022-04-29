import { Box, Text, Layer, Heading } from 'grommet';

export default function MapNotFoundAlert() {
  return (
    <Layer background="popup" position="center" margin="large" role="alert">
      <Box pad="medium" gap="small" width="medium">
        <Heading level={3} margin="none" color="status-error">
          {`Map Not Found`}
        </Heading>
        <Text color="status-error">{`Redirecting to the homepage...`}</Text>
      </Box>
    </Layer>
  );
}
