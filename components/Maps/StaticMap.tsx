import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';

const MAP_BACKGROUND_COLOR = 'rgb(101, 196, 236)';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v11';

const StaticMap: React.FC<{ height?: HeightType; id: string }> = ({ height = '100%', id }) => {
  useEffect(() => {
    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';

      const map = new mapboxgl.Map({
        container: id,
        style: MAPBOX_STYLE,
        center: [25, 20],
        zoom: 1,
        localFontFamily: "'Roboto', sans-serif",
        interactive: false,
      });
      return () => {
        if (map) {
          map.remove();
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  return <Box id={id} height={height} background={MAP_BACKGROUND_COLOR} />;
};

export default withNoSsr(StaticMap);
