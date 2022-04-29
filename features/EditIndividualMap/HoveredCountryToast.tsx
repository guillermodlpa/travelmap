import { Box, Heading } from 'grommet';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Parchment from '../../components/Parchment';

const FloatingBox = styled(Box)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  top: 80px;

  @media (min-width: ${({ theme }) => theme.global.breakpoints?.small?.value}px) {
    top: 10px;
  }
`;

export default function HoveredCountryToast({
  hoveredCountry,
}: {
  hoveredCountry: undefined | { code: string; name: string };
}) {
  const visible = hoveredCountry !== undefined;
  const animation: Array<'slideDown' | 'fadeIn' | 'slideUp' | 'fadeOut'> = visible
    ? ['fadeIn']
    : ['fadeOut'];

  const [lastValue, setLastValue] = useState<{ code: string; name: string }>();
  useEffect(() => {
    if (hoveredCountry) {
      setLastValue(hoveredCountry);
    } else {
      const timeout = setTimeout(() => {
        setLastValue(undefined);
      }, 50000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hoveredCountry]);

  return (
    <FloatingBox animation={animation}>
      <Parchment
        contentBox={{ pad: { horizontal: 'medium', vertical: 'small' } }}
        insetShadowSize="xsmall"
      >
        <Heading level={5} data-code={lastValue?.code} margin="none" as="span">
          {lastValue?.name}
        </Heading>
      </Parchment>
    </FloatingBox>
  );
}
