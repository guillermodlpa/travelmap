import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import { useTheme } from 'styled-components';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';

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

const addLayerToMap = (map: mapboxgl.Map, id: string, color: string) => {
  map.addLayer(
    {
      id,
      source: 'countryBoundariesV1',
      'source-layer': 'country_boundaries',
      type: 'fill',
      paint: {
        'fill-color': color,
        'fill-opacity': 0.75,
      },
    },
    MAPBOX_STUDIO_LAYER_ANCHOR
  );
};

const LAYER_USER_1 = 'highlighted-countries-1';
const LAYER_USER_2 = 'highlighted-countries-2';
const LAYER_USER_OVERLAP = 'highlighted-countries-overlap';

const updateMapHighlightedCountries = (
  map: mapboxgl.Map,
  highlightedCountries: [string[]] | [string[], string[]]
) => {
  const countriesUser1 = arrayExclude(highlightedCountries[0] || [], highlightedCountries[1] || []);
  const countriesUser2 = arrayExclude(highlightedCountries[1] || [], highlightedCountries[0] || []);
  const countriesOverlap = arrayIntersect(
    highlightedCountries[0] || [],
    highlightedCountries[1] || []
  );
  map.setFilter(LAYER_USER_1, ['in', 'iso_3166_1_alpha_3', ...countriesUser1]);
  map.setFilter(LAYER_USER_2, ['in', 'iso_3166_1_alpha_3', ...countriesUser2]);
  map.setFilter(LAYER_USER_OVERLAP, ['in', 'iso_3166_1_alpha_3', ...countriesOverlap]);
};

function arrayExclude<T>(array1: T[], array2: T[]): T[] {
  return (array1 || []).filter((value) => !(array2 || []).includes(value));
}
function arrayIntersect<T>(array1: T[], array2: T[]): T[] {
  return (array1 || []).filter((value) => (array2 || []).includes(value));
}

type Bounds = [number, number, number, number];

const zoomMapToCountries = (map: mapboxgl.Map, countries: string[]) => {
  if (countries.length === 0) {
    return;
  }
  const filteredBoundaries = simplifiedWorldAdministrativeBoundaries
    .filter(({ iso3 }) => iso3 && countries.includes(iso3))
    .filter(({ bounds }) => bounds != undefined);
  const bounds = filteredBoundaries.map(({ bounds }) => bounds) as Bounds[];

  const overarchingBounds: Bounds = [
    Math.min(...bounds.map((bound) => bound[0])),
    Math.min(...bounds.map((bound) => bound[1])),
    Math.max(...bounds.map((bound) => bound[2])),
    Math.max(...bounds.map((bound) => bound[3])),
  ];

  map.fitBounds(overarchingBounds, {
    padding: { top: 50, bottom: 250, left: 50, right: 50 },
    duration: 5000,
  });
};

const HighlightedCountriesMap: React.FC<{
  height?: HeightType;
  id: string;
  interactive: boolean;
  highlightedCountries?: [string[]] | [string[], string[]];
}> = ({ height = '100%', id, interactive, highlightedCountries = [[], []] }) => {
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
        const thisMap = event.target;
        // include the information of country boundaries
        thisMap.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        const colorUser1 = theme.global.colors['status-ok'] as string;
        const colorUser2 = theme.global.colors['status-critical'] as string;
        const colorOverlap = theme.global.colors['status-warning'] as string;

        addLayerToMap(thisMap, LAYER_USER_1, colorUser1);
        addLayerToMap(thisMap, LAYER_USER_2, colorUser2);
        addLayerToMap(thisMap, LAYER_USER_OVERLAP, colorOverlap);

        updateMapHighlightedCountries(thisMap, highlightedCountries);
        zoomMapToCountries(thisMap, highlightedCountries.flat());
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

  useEffect(() => {
    if (mapRef.current?.loaded()) {
      updateMapHighlightedCountries(mapRef.current, highlightedCountries);
      zoomMapToCountries(mapRef.current, highlightedCountries.flat());
    }
  }, [highlightedCountries]);

  return <Box id={id} height={height} background={backgroundColor} />;
};

export default withNoSsr(HighlightedCountriesMap);
