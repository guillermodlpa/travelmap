import { Box, BoxExtendedProps, ResponsiveContext } from 'grommet';
import { useContext, forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components';
import Parchment from '../Parchment';

const LegendContainer = styled(Box)<BoxExtendedProps & { $size: ResponsiveViewportSize }>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
  left: ${({ $size }) => ($size === 'small' ? '0' : 'auto')};
`;

const Legend = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(({ children }, ref) => {
  const size = useContext(ResponsiveContext) as ResponsiveViewportSize;
  return (
    <LegendContainer
      margin={{ bottom: 'large', horizontal: 'large' }}
      width={{
        width: size === 'small' ? 'auto' : '450px',
        max: size === 'small' ? '100%' : '50%',
      }}
      $size={size}
      ref={ref}
    >
      <Parchment contentPad={{ horizontal: 'medium', vertical: 'small' }}>{children}</Parchment>
    </LegendContainer>
  );
});
Legend.displayName = 'Legend';

export default Legend;
