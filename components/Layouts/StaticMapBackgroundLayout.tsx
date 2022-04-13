import styled from 'styled-components';
import StaticWorldMap from '../../components/Maps/StaticWorldMap';
import Nav from '../../components/Nav';

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/**
 * Using this component as a layout for multiple NextPages enables
 * to keep the map loaded while navigating across pages that use the same layout
 */
const StaticMapBackgroundLayout: React.FC = ({ children }) => {
  return (
    <>
      <FullScreenBackground>
        <StaticWorldMap height="100vh" id="static-background-map" />
      </FullScreenBackground>

      <Nav />

      {children}
    </>
  );
};

export default StaticMapBackgroundLayout;
