import { Box, Button, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import { PATH_LOG_IN, PATH_SIGN_UP } from '../../util/paths';

export default function LoginBlock() {
  const size = useContext(ResponsiveContext);
  return (
    <Box direction="row" gap="medium" wrap justify="center">
      <Button size="large" secondary label="Log In" href={PATH_LOG_IN} />
      <Button
        size="large"
        primary
        label={size === 'small' ? 'Sign Up' : 'Create a Travelmap'}
        href={PATH_SIGN_UP}
      />
    </Box>
  );
}
