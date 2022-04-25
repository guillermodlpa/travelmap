import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import styled, { useTheme } from 'styled-components';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';
import mapStyles from './mapStyles';

const MapboxContainer = styled(Box)<{ $animate: boolean }>`
  & .mapboxgl-canvas {
    animation-name: ${({ $animate }) => ($animate ? 'map-canvas-movement' : 'none')};
    animation-duration: 30s;
    animation-iteration-count: infinite;
  }
  @keyframes map-canvas-movement {
    0% {
      transform: scale(100%);
    }
    50% {
      transform: scale(104%);
    }
    100% {
      transform: scale(100%);
    }
  }
`;

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
  highlightedCountries: Array<{ id: string; countries: string[]; color: string }>
) => {
  highlightedCountries.forEach((descriptor) => {
    map.setFilter(descriptor.id, ['in', 'iso_3166_1_alpha_3', ...descriptor.countries]);
  });
};

type Bounds = [number, number, number, number];

const zoomMapToCountries = (map: mapboxgl.Map, countries: string[], animate: boolean) => {
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
    duration: animate ? 5000 : 0,
  });
};

const HighlightedCountriesMap: React.FC<{
  height?: HeightType;
  id: string;
  interactive: boolean;
  applyMapMotion: boolean;
  animateCamera: boolean;
  highlightedCountries?: Array<{ id: string; countries: string[]; color: string }>;
}> = ({
  height = '100%',
  id,
  interactive,
  applyMapMotion = false,
  animateCamera = true,
  highlightedCountries = [],
}) => {
  const { mode } = useThemeMode();
  const { backgroundColor, mapboxStyle } = mapStyles[mode];
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

      const allCountries = highlightedCountries.map((descriptor) => descriptor.countries).flat();
      zoomMapToCountries(map, allCountries, false);

      map.on('load', (event) => {
        const thisMap = event.target;
        // include the information of country boundaries
        thisMap.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        highlightedCountries.forEach((descriptor) => {
          const color = (theme.global.colors[descriptor.color] as string) || descriptor.color;
          addLayerToMap(thisMap, descriptor.id, color);
        });

        updateMapHighlightedCountries(thisMap, highlightedCountries);
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
      const allCountries = highlightedCountries.map((descriptor) => descriptor.countries).flat();
      zoomMapToCountries(mapRef.current, allCountries, animateCamera);
    }
  }, [highlightedCountries]);

  return (
    <MapboxContainer
      id={id}
      height={height}
      background={backgroundColor}
      $animate={applyMapMotion}
    />
  );
};

export default withNoSsr(HighlightedCountriesMap);
