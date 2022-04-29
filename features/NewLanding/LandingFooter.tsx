import { Anchor, Box } from 'grommet';

export default function LandingFooter() {
  return (
    <Box as="footer" background="parchmentInset" pad={{ horizontal: 'large', vertical: 'medium' }}>
      <Box width="xlarge" align="stretch">
        <Box as="ul" direction="row" justify="end" gap="medium">
          <Box as="li" direction="row" margin="xsmall" justify="center">
            <Anchor
              href="https://github.com/guillermodlpa/travelmap"
              target="_blank"
              color="text-inverted"
            >
              Source code
            </Anchor>
          </Box>
          <Box as="li" direction="row" margin="xsmall" justify="center">
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
