import { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import mapStyles from './mapStyles';

function StaticWorldMap({ height = '100%', id }: { height?: HeightType; id: string }) {
  const { mode } = useThemeMode();
  const mapboxStyle = mapStyles[mode];
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    try {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = undefined;
      }

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';

      const map = new mapboxgl.Map({
        container: id,
        style: mapboxStyle,
        center: [25, 20],
        zoom: 1,
        localFontFamily: "'Roboto', sans-serif",
        interactive: false,
      });

      // map.on('load', (event) => {
      //   const thisMap = event.target;
      // });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = undefined;
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, [mapboxStyle, id]);

  return <Box id={id} height={height} background="map-background" />;
}

export default withNoSsr(StaticWorldMap);
