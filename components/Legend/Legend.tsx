import { Box, ResponsiveContext } from 'grommet';
import { useContext } from 'react';
import styled from 'styled-components';

const LegendContainer = styled(Box)<{ $viewportSize: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
  max-width: ${(props) => (props.$viewportSize === 'small' ? '100%' : '50%')};
`;

const Legend: React.FC = ({ children }) => {
  const size = useContext(ResponsiveContext);
  return (
    <LegendContainer
      background="paper"
      pad="medium"
      margin={{ bottom: 'large', horizontal: 'large' }}
      elevation="small"
      width={size === 'small' ? 'auto' : '450px'}
      $viewportSize={size}
    >
      {children}
    </LegendContainer>
  );
};

export default Legend;
