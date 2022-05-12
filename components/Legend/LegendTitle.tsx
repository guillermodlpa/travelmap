import { Avatar, Box, Button, Heading, Anchor } from 'grommet';
import { Edit } from 'grommet-icons';
import { SyntheticEvent } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';

const NBSP_CHAR = '\u00A0';

const AnchorButton = styled(Anchor)`
  transform: scale(1);
  transition: transform 0.1s ease-in-out;
  &:hover,
  &:focus {
    transform: scale(1.1);
  }
`;

const AvatarContainer = styled.div<{ $position: number }>`
  z-index: ${({ $position }) => 10 - $position};
  margin-left: -${({ $position }) => 12 * $position}px;
  &:hover {
    z-index: 10;
  }
`;

function ConditionalLink({
  href,
  children,
}: {
  href: string | undefined;
  children: React.ReactNode;
}) {
  return !href ? (
    <>{children}</>
  ) : (
    <NextLink href={href} passHref>
      <AnchorButton style={{ display: 'block', borderRadius: '100%' }}>{children}</AnchorButton>
    </NextLink>
  );
}

const defaultAvatar = { id: '_', name: '', pictureUrl: null, href: undefined };

interface LegendTitleProps {
  heading: string | undefined;
  avatars: { id: string; name: string; href?: string; pictureUrl: string | null }[] | undefined;
  showEditNameButton?: boolean;
  onClickEditNameButton?: (event: SyntheticEvent) => void;
}

export default function LegendTitle({
  heading,
  avatars = [defaultAvatar],
  showEditNameButton = false,
  onClickEditNameButton,
}: LegendTitleProps) {
  return (
    <Box direction="row" align="center" gap="small" flex={{ shrink: 0 }}>
      <Box direction="row" flex={{ shrink: 0 }}>
        {avatars.map(({ id, name, pictureUrl, href }, index) => (
          <AvatarContainer $position={index} key={id}>
            <ConditionalLink href={href}>
              <Avatar
                background="parchment"
                border={{ color: 'brand', size: 'small' }}
                src={pictureUrl || undefined}
              >
                {(name || '').substring(0, 1)}
              </Avatar>
            </ConditionalLink>
          </AvatarContainer>
        ))}
      </Box>
      {heading !== undefined && (
        <Box
          border={{ color: 'brand', size: 'small', side: 'bottom' }}
          flex={{ shrink: 1, grow: 1 }}
        >
          <Heading as="h1" level={4} responsive={false} size="small" margin={{ bottom: 'small' }}>
            {heading}
          </Heading>
        </Box>
      )}

      {showEditNameButton && (
        <Box flex={{ shrink: 0 }} alignSelf="center">
          <Button
            icon={<Edit color="brand" />}
            size="medium"
            tip="Edit name and picture"
            a11yTitle="Edit name and picture"
            onClick={onClickEditNameButton}
          />
        </Box>
      )}
    </Box>
  );
}
