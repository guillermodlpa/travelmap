import { Box, BoxExtendedProps } from 'grommet';
import { useId } from 'react';
import styled from 'styled-components';

const ParchmentContainer = styled(Box)`
  position: relative;
  z-index: 2;
`;

const ParchmentContent = styled(Box)`
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
  $filterId: string;
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
  filter: ${({ $filterId }) => `url(#${$filterId})`};
  /* iOS Safari workaround. https://stackoverflow.com/a/58289524/2853239 */
  transform: translateZ(0);
`;

/**
 * Based on https://codepen.io/AgnusDei/pen/NWPbOxL
 */
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
  const filterId = `wavy-${useId()}`;

  return (
    <>
      <ParchmentContainer {...containerBox}>
        <ParchmentContent {...contentBox}>{children}</ParchmentContent>
        <ParchmentBackground
          background="parchment"
          $insetShadowSize={insetShadowSize}
          $filterId={filterId}
        />
      </ParchmentContainer>

      {/* the svg styles are a workaround bc display none doesn't work in Firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=376027 */}
      <svg style={{ position: 'absolute', height: '0' }}>
        <filter id={filterId}>
          {/* @todo: replace wavy2 with React 18's useId */}
          <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="10" />
        </filter>
      </svg>
    </>
  );
}
