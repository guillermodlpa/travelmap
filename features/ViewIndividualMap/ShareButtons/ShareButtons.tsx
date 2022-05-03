import { Box, Button, ButtonExtendedProps, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import styled, { useTheme } from 'styled-components';

import ShareButtonEmail from './share-button-email.svg';
import ShareButtonFacebook from './share-button-facebook.svg';
import ShareButtonTwitter from './share-button-twitter.svg';
import ShareButtonWhatsapp from './share-button-whatsapp.svg';

const VerticalButton = styled(Button)`
  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }
`;

type SvgComponentType = React.ComponentType<{
  width?: string;
  height?: string;
}>;

const getEmailHref = (mapUrl: string, mapName: string): string => {
  const subject = `🗺  ${mapName} - Travelmap`;
  const body = `Hi,

I wanted to share with you my Travelmap of visited countries, ${mapName}, ${mapUrl}

If you sign up and then open my map, you can create a map together that shows the countries we both have visited!

Cheers
`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const getWhatsAppHref = (mapUrl: string, mapName: string): string => {
  const text = `${mapName}

${mapUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

const getTwitterHref = (mapUrl: string, mapName: string): string => {
  const text = `${mapName}, check it out.`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(mapUrl)}`;
};

const getFacebookHref = (mapUrl: string): string =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mapUrl)}`;

function ShareButton({
  label,
  Icon,
  ...props
}: { label: string; Icon: SvgComponentType } & ButtonExtendedProps) {
  const size = useContext(ResponsiveContext);
  const theme = useTheme();
  const shareButtonSize = theme.avatar.size[size === 'small' ? 'small' : 'medium'];
  return (
    <VerticalButton
      {...(props.href ? { target: '_blank' } : {})}
      {...props}
      size="small"
      icon={<Icon width={shareButtonSize} height={shareButtonSize} />}
      label={size === 'small' ? undefined : label}
    />
  );
}

export default function ShareButtons({ mapUrl, mapName }: { mapUrl: string; mapName: string }) {
  return (
    <Box direction="row" wrap gap="small" justify="center">
      <ShareButton label="Email" Icon={ShareButtonEmail} href={getEmailHref(mapUrl, mapName)} />
      <ShareButton
        label="WhatsApp"
        Icon={ShareButtonWhatsapp}
        href={getWhatsAppHref(mapUrl, mapName)}
        data-action="share/whatsapp/share"
      />
      <ShareButton
        label="Twitter"
        Icon={ShareButtonTwitter}
        href={getTwitterHref(mapUrl, mapName)}
      />
      <ShareButton label="Facebook" Icon={ShareButtonFacebook} href={getFacebookHref(mapUrl)} />
    </Box>
  );
}
