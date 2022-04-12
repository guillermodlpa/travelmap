import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import { useRouter } from 'next/router';
import { useContext, forwardRef, PropsWithChildren, useEffect, RefObject, useState } from 'react';
import styled from 'styled-components';
import Parchment from '../Parchment';

type LegendContainerStyleProps = { $size: ResponsiveViewportSize; $bottom: string; $right: string };

const LegendContainer = styled(Box)<BoxExtendedProps & LegendContainerStyleProps>`
  position: absolute;
  bottom: ${({ $bottom }) => $bottom};
  right: ${({ $right }) => $right};
  right: 0;
  z-index: 10;
  left: ${({ $size }) => ($size === 'small' ? '0' : 'auto')};
`;

const Legend = forwardRef<HTMLElement, PropsWithChildren<{ target?: RefObject<HTMLDivElement> }>>(
  ({ children, target }, ref) => {
    const size = useContext(ResponsiveContext) as ResponsiveViewportSize;
    const router = useRouter();

    const [coordinates, setCoordinates] = useState<{ bottom: string; right: string }>({
      bottom: '0',
      right: '0',
    });
    useEffect(() => {
      if (target && target.current) {
        const { right, top } = target.current.getBoundingClientRect();
        setCoordinates({
          right: `${window.innerWidth - right}px`,
          bottom: `${window.innerHeight - top}px`,
        });
      } else {
        setCoordinates({ bottom: '0', right: '0' });
      }
    }, [target, router.pathname]);

    return (
      <LegendContainer
        margin={{ bottom: 'large', horizontal: 'large' }}
        width={{
          width: size === 'small' ? 'auto' : '450px',
          max: size === 'small' ? '100%' : '50%',
        }}
        $size={size}
        $bottom={coordinates.bottom}
        $right={coordinates.right}
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        animation={{ delay: 100, type: 'fadeIn' }}
      >
        <Parchment
          contentPad={{ horizontal: 'medium', top: 'small', bottom: 'medium' }}
          insetShadowSize="medium"
        >
          <Box direction="column" gap="medium">
            {children}
          </Box>
        </Parchment>
      </LegendContainer>
    );
  }
);
Legend.displayName = 'Legend';

export default Legend;
