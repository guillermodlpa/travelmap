import Nav from '../components/Nav';

/**
 * Using a common component as a layout for multiple NextPages enables
 * to keep the map loaded while navigating across pages that use the same layout
 */
const MapViewLayout: React.FC = ({ children }) => {
  return (
    <>
      <Nav />

      {children}
    </>
  );
};

export default MapViewLayout;
