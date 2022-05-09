import styled from 'styled-components';
import WorldMapImage from '../components/Maps/WorldMapImage';
import Nav from '../components/Nav';

const FullScreenBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/**
 * Using a common component as a layout for multiple NextPages enables
 * to keep the map loaded while navigating across pages that use the same layout
 */
export default function StaticMapBackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />

      <FullScreenBackground>
        <WorldMapImage />
      </FullScreenBackground>

      {children}
    </>
  );
}
