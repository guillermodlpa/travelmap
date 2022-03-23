import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeMode/ThemeModeContext';

const MAP_STYLES = {
  dark: {
    backgroundColor: '#78543a',
    mapboxStyle: 'mapbox://styles/gpuenteallott/cl13v693v000d16p6av56zszg',
  },
  light: {
    backgroundColor: '#cfb19b',
    mapboxStyle: 'mapbox://styles/gpuenteallott/cl13uyc77006k14m4lmeto0zj',
  },
};

const StaticMap: React.FC<{ height?: HeightType; id: string }> = ({ height = '100%', id }) => {
  const { mode } = useThemeMode();
  const { backgroundColor, mapboxStyle } = MAP_STYLES[mode];
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';

      mapRef.current = new mapboxgl.Map({
        container: id,
        style: mapboxStyle,
        center: [25, 20],
        zoom: 1,
        localFontFamily: "'Roboto', sans-serif",
        interactive: false,
      });
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapboxStyle);
    }
  }, [mapboxStyle]);

  return <Box id={id} height={height} background={backgroundColor} />;
};

export default withNoSsr(StaticMap);
