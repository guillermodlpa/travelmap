import { Avatar, Box, Button, Heading } from 'grommet';
import { FormEdit } from 'grommet-icons';
import { SyntheticEvent } from 'react';
import NextLink from 'next/link';

const NBSP_CHAR = '\u00A0';

interface LegendTitleProps {
  heading: string | undefined;
  avatars: { id: string; name: string; href?: string; pictureUrl: string | null }[] | undefined;
  showEditNameButton?: boolean;
  onClickEditNameButton?: (event: SyntheticEvent) => void;
}

const ConditionalLink: React.FC<{ href: string | undefined }> = ({ href, children }) =>
  !href ? <>{children}</> : <NextLink href={href}>{children}</NextLink>;

const defaultAvatar = { id: '_', name: '', pictureUrl: null, href: undefined };

const LegendTitle: React.FC<LegendTitleProps> = ({
  heading,
  avatars = [defaultAvatar],
  showEditNameButton = false,
  onClickEditNameButton,
}) => (
  <Box direction="row" align="center" gap="small">
    <Box direction="row" flex={{ shrink: 0 }}>
      {avatars.map(({ id, name, pictureUrl, href }, index) => (
        <ConditionalLink href={href} key={id}>
          <Avatar
            background="parchment"
            border={{ color: 'brand', size: 'small' }}
            margin={{ left: `-${24 * index}px` }}
            style={{ zIndex: avatars.length - index }}
            src={pictureUrl || undefined}
          >
            {(name || '').substring(0, 1)}
          </Avatar>
        </ConditionalLink>
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
