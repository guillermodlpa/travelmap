import { Anchor, Box, ResponsiveContext } from 'grommet';
import { useContext } from 'react';

export default function LandingFooter() {
  const size = useContext(ResponsiveContext);
  return (
    <Box as="footer" background="parchmentInset" pad={{ horizontal: 'large', vertical: 'medium' }}>
      <Box width="xlarge" align="stretch">
        <Box as="ul" direction={size === 'small' ? 'column' : 'row'} justify="end" gap="medium">
          <Box as="li" direction="row" margin="xsmall" justify={size === 'small' ? 'start' : 'end'}>
            <Anchor
              href="https://github.com/guillermodlpa/travelmap/issues"
              target="_blank"
              color="text-inverted"
            >
              Report an issue
            </Anchor>
          </Box>
          <Box as="li" direction="row" margin="xsmall" justify={size === 'small' ? 'start' : 'end'}>
            <Anchor
              href="https://github.com/guillermodlpa/travelmap"
              target="_blank"
              color="text-inverted"
            >
              Source code
            </Anchor>
          </Box>
          <Box as="li" direction="row" margin="xsmall" justify={size === 'small' ? 'start' : 'end'}>
            <Anchor
              href="https://guillermodlpa.com"
              target="_blank"
              color="text-inverted"
            >{`About the author`}</Anchor>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
