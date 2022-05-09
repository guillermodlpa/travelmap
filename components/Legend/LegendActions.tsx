import { Box, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import styled from 'styled-components';

const PositionedBox = styled(Box)`
  position: absolute;
  bottom: ${({ theme }) => theme.global.edgeSize?.small};
  right: ${({ theme }) => theme.global.edgeSize?.small};
`;

export default function LegendActions({ children }: { children: React.ReactNode }) {
  const size = useContext(ResponsiveContext);
  return (
    <>
      <PositionedBox
        gap="xsmall"
        align="center"
        direction="row"
        justify={size === 'small' ? 'center' : 'end'}
        flex={{ shrink: 0 }}
      >
        {children}
      </PositionedBox>
    </>
  );
}
