import { Avatar, Box, Button, Heading } from 'grommet';
import { FormEdit } from 'grommet-icons';
import { SyntheticEvent } from 'react';

const NBSP_CHAR = '\u00A0';

interface LegendTitleProps {
  heading: string | undefined;
  avatars: { id: string; name: string }[] | undefined;
  showEditNameButton?: boolean;
  onClickEditNameButton?: (event: SyntheticEvent) => void;
}

const defaultAvatar = { id: '_', name: '' };

const LegendTitle: React.FC<LegendTitleProps> = ({
  heading,
  avatars = [defaultAvatar],
  showEditNameButton = false,
  onClickEditNameButton,
}) => (
  <Box direction="row" align="end" gap="small">
    <Box direction="row" flex={{ shrink: 0 }}>
      {avatars.map(({ id, name }, index) => (
        <Avatar
          key={id}
          background="parchment"
          border={{ color: 'brand', size: 'small' }}
          margin={{ left: `-${24 * index}px` }}
          style={{ zIndex: avatars.length - index }}
          // src={avatarSrc}
        >
          {(name || '').substring(0, 1)}
        </Avatar>
      ))}
    </Box>
    <Box border={{ color: 'brand', size: 'small', side: 'bottom' }} flex={{ shrink: 1, grow: 1 }}>
      <Heading level={1} size="small">
        {heading || NBSP_CHAR}
      </Heading>
    </Box>
    {showEditNameButton && (
      <Box flex={{ shrink: 0 }} alignSelf="center">
        <Button
          icon={<FormEdit color="text" />}
          plain
          tip="Edit name"
          a11yTitle="Edit name"
          onClick={onClickEditNameButton}
        />
      </Box>
    )}
  </Box>
);

export default LegendTitle;
