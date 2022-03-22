import { Box, ResponsiveContext } from 'grommet';
import { useContext, forwardRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

const LegendContainer = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
`;

const Legend = forwardRef<HTMLDivElement, PropsWithChildren<{}>>(({ children }, ref) => {
  const size = useContext(ResponsiveContext);
  return (
    <LegendContainer
      background="paper"
      pad="medium"
      margin={{ bottom: 'large', horizontal: 'large' }}
      elevation="small"
      width={{
        width: size === 'small' ? 'auto' : '450px',
        max: size === 'small' ? '100%' : '50%',
      }}
      ref={ref}
    >
      {children}
    </LegendContainer>
  );
});
Legend.displayName = 'Legend';

export default Legend;
