import { Avatar, Box, Heading } from 'grommet';

const NBSP_CHAR = '\u00A0';

interface LegendTitleProps {
  heading: string | undefined;
  avatars: { id: string; name: string }[] | undefined;
}

const defaultAvatar = { id: '_', name: '' };

const LegendTitle: React.FC<LegendTitleProps> = ({ heading, avatars = [defaultAvatar] }) => (
  <Box direction="row" margin={{ bottom: 'medium' }} align="end" gap="small" wrap>
    <Box direction="row" flex={{ shrink: 0 }}>
      {avatars.map(({ id, name }, index) => (
        <Avatar
          key={id}
          border={{ color: 'brand', size: 'small' }}
          margin={{ left: `-${24 * index}px` }}
          style={{ zIndex: avatars.length - index }}
          // src={avatarSrc}
        >
          {name.substring(0, 1)}
        </Avatar>
      ))}
    </Box>
    <Box border={{ color: 'brand', size: 'small', side: 'bottom' }} flex>
      <Heading level={1} size="small">
        {heading || NBSP_CHAR}
      </Heading>
    </Box>
  </Box>
);

export default LegendTitle;
