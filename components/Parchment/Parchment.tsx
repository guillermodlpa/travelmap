import { Box, BoxExtendedProps } from 'grommet';
import { PadType } from 'grommet/utils';
import { createRef, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const BoxForwardingRef = forwardRef<HTMLDivElement, BoxExtendedProps>((props, ref) => (
  <Box ref={ref} {...props} />
));
BoxForwardingRef.displayName = 'BoxForwardingRef';

const ParchmentContainer = styled(BoxForwardingRef)`
  position: relative;
`;

const ParchmentContent = styled(BoxForwardingRef)`
  z-index: 1;
`;

const insetShadowSizes = {
  xsmall: '5px',
  small: '25px',
  medium: '50px',
  large: '100px',
};

const ParchmentBackground = styled(Box)<{
  $insetShadowSize: 'xsmall' | 'small' | 'medium' | 'large';
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: ${({ theme }) => theme.global.elevation[theme.dark ? 'dark' : 'light'].large},
    0 0 ${({ $insetShadowSize }) => insetShadowSizes[$insetShadowSize]}
      ${({ theme }) => theme.global.colors.parchmentInset[theme.dark ? 'dark' : 'light']} inset,
    0 0 10px ${({ theme }) => theme.global.colors.parchmentInset[theme.dark ? 'dark' : 'light']}
      inset,
    0 0 10px ${({ theme }) => theme.global.colors.parchmentInset[theme.dark ? 'dark' : 'light']}
      inset;
  filter: url(#wavy2);
`;

const Parchment: React.FC<{
  contentPad?: PadType;
  insetShadowSize?: 'xsmall' | 'small' | 'medium' | 'large';
}> = ({ children, contentPad, insetShadowSize = 'large' }) => {
  const content = createRef<HTMLDivElement>();
  const [backgroundHeight, setBackgroundHeight] = useState<number>();

  useEffect(() => {
    if (content?.current) {
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        const height = entry.contentBoxSize
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.width;
        setBackgroundHeight(height);
      });
      const node = content.current;
      resizeObserver.observe(node);
      return () => {
        resizeObserver.unobserve(node);
      };
    }
  }, [content]);

  return (
    <>
      <ParchmentContainer ref={content}>
        <ParchmentContent pad={contentPad}>{children}</ParchmentContent>
        <ParchmentBackground
          background="parchment"
          height={backgroundHeight ? `${backgroundHeight}px` : undefined}
          $insetShadowSize={insetShadowSize}
        />
      </ParchmentContainer>

      <svg display="none">
        <filter id="wavy2">
          {/* @todo: replace wavy2 with React 18's useId */}
          <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="10" />
        </filter>
      </svg>
    </>
  );
};

export default Parchment;
