import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import { useTheme } from 'styled-components';

const MAP_STYLES = {
  dark: {
    backgroundColor: '#78543a',
    mapboxStyle: 'mapbox://styles/gpuenteallott/cl195e9ja002f14o09biv9ntq',
  },
  light: {
    backgroundColor: '#cfb19b',
    mapboxStyle: 'mapbox://styles/gpuenteallott/cl1953d18005r14o33cb7z60t',
  },
};

// There has to be a layer in the map named like this above the map style layers
const MAPBOX_STUDIO_LAYER_ANCHOR = 'country lines';

const StaticMap: React.FC<{
  height?: HeightType;
  id: string;
  interactive: boolean;
  highlightedCountries?: string[][];
}> = ({ height = '100%', id, interactive, highlightedCountries = [] }) => {
  const { mode } = useThemeMode();
  const { backgroundColor, mapboxStyle } = MAP_STYLES[mode];
  const mapRef = useRef<mapboxgl.Map>();

  const theme = useTheme();

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
        interactive,
      });

      map.on('load', (event) => {
        // include the information of country boundaries
        map.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        const highlightColors = [
          theme.global.colors['status-ok'] as string,
          theme.global.colors['status-critical'] as string,
        ];

        highlightedCountries.forEach((countrySet, index) => {
          // add a layer of visited countries
          map.addLayer(
            {
              id: `highlighted-countries-${index}`,
              source: 'countryBoundariesV1',
              'source-layer': 'country_boundaries',
              type: 'fill',
              paint: {
                'fill-color': highlightColors[index] || 'black',
                'fill-opacity': 0.75,
              },
            },
            MAPBOX_STUDIO_LAYER_ANCHOR
          );

          // for now, we set the filter without any countries
          map.setFilter(`highlighted-countries-${index}`, [
            'in',
            'iso_3166_1_alpha_3',
            ...countrySet,
          ]);
        });
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          // setMapLoaded(false);
          mapRef.current.remove();
          mapRef.current = undefined;
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, [mapboxStyle, id, interactive, theme]);

  return <Box id={id} height={height} background={backgroundColor} />;
};

export default withNoSsr(StaticMap);
