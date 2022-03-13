import { Box, Footer, Header, Main } from 'grommet';
import ResponsiveGrid from './ResponsiveGrid';

interface AppLayoutProps {
  header: React.ReactElement;
  mapContainer: React.ReactElement;
  main: React.ReactElement;
  footer: React.ReactElement;
}

const AppLayout: React.FC<AppLayoutProps> = ({ header, mapContainer, main, footer }) => {
  return (
    <ResponsiveGrid
      fill
      mediumGridProps={{
        rows: ['auto', 'flex', 'auto'],
        columns: ['66%', '34%'],
        areas: [
          { name: 'mapContainer', start: [0, 0], end: [0, 2] },
          { name: 'header', start: [1, 0], end: [1, 0] },
          { name: 'main', start: [1, 1], end: [1, 1] },
          { name: 'footer', start: [1, 2], end: [1, 2] },
        ],
      }}
      smallGridProps={{
        rows: ['66vh', 'auto', 'flex', 'auto'],
        columns: ['100%'],
        areas: [
          { name: 'mapContainer', start: [0, 0], end: [0, 0] },
          { name: 'header', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [0, 2], end: [0, 2] },
          { name: 'footer', start: [0, 3], end: [0, 3] },
        ],
      }}
    >
      <Box gridArea="mapContainer">{mapContainer}</Box>

      <Header
        gridArea="header"
        background="background-back"
        responsive={false}
        pad={{ horizontal: 'small', vertical: 'medium' }}
      >
        {header}
      </Header>

      <Main
        gridArea="main"
        justify="center"
        align="center"
        background="background-back"
        animation={[
          { type: 'fadeIn', duration: 300 },
          { type: 'slideUp', size: 'xlarge', duration: 150 },
        ]}
      >
        {main}
      </Main>

      <Footer
        pad={{ horizontal: 'medium', vertical: 'medium' }}
        responsive={false}
        background="background-front"
      >
        {footer}
      </Footer>
    </ResponsiveGrid>
  );
};

export default AppLayout;
