import { Box, Button, Text } from 'grommet';
import React, { forwardRef, ReactElement, useEffect, useState } from 'react';
import { FormClose } from 'grommet-icons';
import styled from 'styled-components';

type InfoProps = React.PropsWithChildren<{
  icon?: ReactElement | null;
  actions?: ReactElement | null;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  bottom?: number;
  delay?: number;
  relativeRef?: React.RefObject<HTMLDivElement>;
  message: string;
}>;

const BoxWithFixedPositioning = styled(Box)<{ $bottom?: number }>`
  position: absolute;
  bottom: ${(props) => props.$bottom || 0}px;
  right: 0;
`;

export const Info = forwardRef<HTMLDivElement, InfoProps>(
  ({ icon, actions, open, setOpen = () => {}, bottom = 0, delay = 0, message }, ref) => {
    return (
      <BoxWithFixedPositioning
        background="info"
        ref={ref}
        $bottom={bottom}
        margin={{ bottom: 'large', horizontal: 'large' }}
        width={{ width: 'medium', max: '75%' }}
        animation={
          open
            ? [
                { type: 'slideLeft', size: 'large', delay },
                { type: 'fadeIn', size: 'small', delay },
              ]
            : [{ type: 'fadeOut', size: 'small', delay: 0 }]
        }
      >
        <Box
          role="alert"
          direction="row"
          align="center"
          as="header"
          elevation="small"
          justify="between"
          pad={{ left: 'medium', vertical: 'small' }}
          gap="medium"
        >
          {icon}
          <Box gap="small" direction="column" align="start">
            <Text>{message}</Text>
            {actions && (
              <Box gap="small" direction="row">
                {actions}
              </Box>
            )}
          </Box>
          <Button
            icon={<FormClose />}
            a11yTitle="Close notification"
            onClick={() => setOpen(false)}
          />
        </Box>
      </BoxWithFixedPositioning>
    );
  }
);
Info.displayName = 'Info';

export const withoutControl = (Component: typeof Info) => {
  const InfoUncontrolled = forwardRef<HTMLDivElement, InfoProps>((props, ref) => {
    const [open, setOpen] = useState(true);
    return <Component {...props} open={open} setOpen={setOpen} ref={ref} />;
  });
  InfoUncontrolled.displayName = 'InfoUncontrolled';
  return InfoUncontrolled;
};

export const withRelativePositioning = (Component: typeof Info) => {
  const InfoWithRelativePositioning = forwardRef<HTMLDivElement, InfoProps>(
    ({ relativeRef, ...props }, ref) => {
      const [bottom, setBottom] = useState<number | undefined>(undefined);
      useEffect(() => {
        if (relativeRef && relativeRef.current) {
          const { top } = relativeRef.current.getBoundingClientRect();
          const distanceTopToViewportBottom = window.innerHeight - top;
          setBottom(distanceTopToViewportBottom);
        }
      }, [relativeRef]);
      return <Component ref={ref} {...props} bottom={bottom} />;
    }
  );
  InfoWithRelativePositioning.displayName = 'InfoWithRelativePositioning';
  return InfoWithRelativePositioning;
};

export const InfoNotification = withRelativePositioning(withoutControl(Info));
