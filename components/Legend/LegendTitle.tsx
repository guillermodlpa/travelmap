import { Avatar, Box, Button, Heading, Anchor } from 'grommet';
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
  !href ? (
    <>{children}</>
  ) : (
    <NextLink href={href} passHref>
      <Anchor style={{ display: 'block', borderRadius: '100%' }}>{children}</Anchor>
    </NextLink>
  );

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
        <div style={{ marginLeft: `-${24 * index}px`, zIndex: avatars.length - index }} key={id}>
          <ConditionalLink href={href}>
            <Avatar
              background="parchment"
              border={{ color: 'brand', size: 'small' }}
              src={pictureUrl || undefined}
            >
              {(name || '').substring(0, 1)}
            </Avatar>
          </ConditionalLink>
        </div>
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
