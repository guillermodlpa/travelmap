import { Avatar, Box, Heading } from 'grommet';

interface LegendTitleProps {
  avatarSrc?: string;
  avatarContent?: string;
  headingText: string;
}

const LegendTitle: React.FC<LegendTitleProps> = ({ avatarSrc, avatarContent, headingText }) => (
  <Box direction="row" margin={{ bottom: 'medium' }} align="end" gap="small" wrap>
    <Avatar border={{ color: 'white', size: 'small' }} size="medium" src={avatarSrc}>
      {avatarContent}
    </Avatar>
    <Box border={{ color: 'white', size: 'small', side: 'bottom' }} flex>
      <Heading level={1} size="small">
        {headingText}
      </Heading>
    </Box>
  </Box>
);

export default LegendTitle;
