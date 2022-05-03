import { Box, BoxExtendedProps } from 'grommet';
import { createRef, forwardRef, useEffect } from 'react';
import styled from 'styled-components';

const BoxForwardingRef = forwardRef<HTMLDivElement, BoxExtendedProps>((props, ref) => (
  <Box ref={ref} {...props} />
));
BoxForwardingRef.displayName = 'BoxForwardingRef';

const ParchmentContainer = styled(BoxForwardingRef)`
  position: relative;
  z-index: 2;
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
  /* iOS Safari workaround. https://stackoverflow.com/a/58289524/2853239 */
  transform: translateZ(0);
`;

const isResizeObserverSupported = (): boolean =>
  typeof window !== 'undefined' && typeof window.ResizeObserver !== 'undefined';

export default function Parchment({
  children,
  contentBox = {},
  containerBox = {},
  insetShadowSize = 'large',
}: {
  children: React.ReactNode;
  contentBox?: BoxExtendedProps;
  containerBox?: BoxExtendedProps;
  insetShadowSize?: 'xsmall' | 'small' | 'medium' | 'large';
}) {
  const content = createRef<HTMLDivElement>();
  const background = createRef<HTMLDivElement>();
  const resizeObserverSupported = isResizeObserverSupported();

  useEffect(() => {
    if (content?.current && isResizeObserverSupported()) {
      const node = content.current;
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        const height = entry.contentBoxSize
          ? entry.borderBoxSize[0].blockSize
          : entry.contentRect.height;

        background?.current?.setAttribute('height', `${height}`);
      });
      resizeObserver.observe(node);
      return () => {
        resizeObserver.unobserve(node);
      };
    }
  }, [content, background]);

  return (
    <>
      <ParchmentContainer
        {...containerBox}
        background={resizeObserverSupported ? 'transparent' : 'parchment'}
      >
        <ParchmentContent {...contentBox} ref={content}>
          {children}
        </ParchmentContent>
        {resizeObserverSupported && (
          <ParchmentBackground
            background="parchment"
            ref={background}
            $insetShadowSize={insetShadowSize}
          />
        )}
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
}
