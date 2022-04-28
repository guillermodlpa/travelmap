import { useEffect, useRef, useState } from 'react';
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
  map.setFilter(id, ['in', 'iso_3166_1_alpha_3']); // none selected initially
};

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

const addCountryHoverInteractivity = (
  map: mapboxgl.Map,
  fillColor: string,
  onCountryClicked: (code: string) => void
) => {
  // add a transparent layer of countries. We use it when interacting with the map to know which country it is
  map.addLayer(
    {
      id: 'country-fills',
      type: 'fill',
      source: 'countryBoundariesV1',
      'source-layer': 'country_boundaries',
      layout: {},
      paint: {
        'fill-color': '#fff',
        'fill-opacity': 0, // @todo: make this 0
      },
    },
    MAPBOX_STUDIO_LAYER_ANCHOR
  );

  // add a layer of countries, in which only one filtered country is visible. We'll configure that
  // filter when hovering over the map
  map.addLayer(
    {
      id: 'country-fills-hover',
      type: 'fill',
      source: 'countryBoundariesV1',
      'source-layer': 'country_boundaries',
      layout: {},
      paint: {
        'fill-color': fillColor,
        'fill-opacity': 0.5,
      },
      filter: ['==', 'name', ''],
    },
    'country-fills'
  );

  // When the user moves their mouse over the page, we look for features
  // at the mouse position (e.point) and within the states layer (countries-fill).
  // If a feature is found, then we'll update the filter in the state-fills-hover
  // layer to only show that state, thus making a hover effect.
  map.on('mousemove', (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });
    if (features.length) {
      map.getCanvas().style.cursor = 'pointer';
      map.setFilter('country-fills-hover', ['==', 'name', features[0].properties?.name]);
    } else {
      map.setFilter('country-fills-hover', ['==', 'name', '']);
      map.getCanvas().style.cursor = '';
    }
  });

  // Reset the country-fills-hover layer's filter when the mouse leaves the map
  map.on('mouseout', () => {
    map.getCanvas().style.cursor = 'auto';
    map.setFilter('country-fills-hover', ['==', 'name', '']);
  });

  map.on('click', (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: ['country-fills'],
    });
    const country = features && features.length ? features[0].properties?.iso_3166_1_alpha_3 : null;
    if (country) {
      onCountryClicked(country);
    }
  });
};

type HighlighedCountriesMapProps = {
  height?: HeightType;
  id: string;
  interactive: boolean;
  applyMapMotion: boolean;
  animateCamera: boolean;
  zoomCountriesOnLoad: boolean;
  highlightedCountries?: Array<{ id: string; countries: string[]; color: string }>;
  countriesCanBeSelected: boolean;
  onCountrySelected?: (code: string) => void;
};

function HighlightedCountriesMap({
  height = '100%',
  id,
  interactive,
  applyMapMotion = false,
  animateCamera = true,
  zoomCountriesOnLoad = false,
  highlightedCountries = [],
  countriesCanBeSelected,
  onCountrySelected = () => {},
}: HighlighedCountriesMapProps) {
  const { mode } = useThemeMode();
  const mapboxStyle = mapStyles[mode];
  const mapRef = useRef<mapboxgl.Map>();
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const theme = useTheme();

  const interactiveInitialValue = useRef(interactive).current;
  const countriesCanBeSelectedInitialValue = useRef(countriesCanBeSelected).current;
  const onCountrySelectedInitialValue = useRef(onCountrySelected).current;
  const themeInitialValue = useRef(theme).current;
  const highlightedCountriesInitialValue = useRef(highlightedCountries).current;

  useEffect(() => {
    try {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = undefined;
        setMapLoaded(false);
      }

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';

      const map = new mapboxgl.Map({
        container: id,
        style: mapboxStyle,
        center: [25, 20],
        zoom: 1,
        localFontFamily: "'Roboto', sans-serif",
        interactive: interactiveInitialValue,
        doubleClickZoom: false,
      });

      map.on('load', (event) => {
        const thisMap = event.target;
        // include the information of country boundaries
        thisMap.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        highlightedCountriesInitialValue.forEach((descriptor) => {
          const color =
            (themeInitialValue.global.colors[descriptor.color] as string) || descriptor.color;
          addLayerToMap(thisMap, descriptor.id, color);
        });

        if (countriesCanBeSelectedInitialValue) {
          addCountryHoverInteractivity(
            thisMap,
            themeInitialValue.global.colors.border[themeInitialValue.dark ? 'dark' : 'light'],
            onCountrySelectedInitialValue
          );
        }

        setMapLoaded(true);
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = undefined;
          setMapLoaded(false);
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, [
    mapboxStyle,
    id,
    interactiveInitialValue,
    countriesCanBeSelectedInitialValue,
    onCountrySelectedInitialValue,
    themeInitialValue,
    highlightedCountriesInitialValue,
  ]);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      try {
        updateMapHighlightedCountries(mapRef.current, highlightedCountries);
      } catch (error: unknown) {
        // Often, the map style isn't ready. We then wait for it to be iddle.
        // This results in faster UI than checking first if we can perform the action with .loaded()
        if (error instanceof Error && error.message === 'Style is not done loading') {
          mapRef.current.once('idle', (event: mapboxgl.MapboxEvent) => {
            updateMapHighlightedCountries(event.target, highlightedCountries);
          });
        }
      }
    }
  }, [highlightedCountries, mapLoaded]);

  const [countriesLoaded, setCountriesLoaded] = useState<boolean>(false);
  const animateCameraInitialValue = useRef(animateCamera).current;
  const zoomCountriesOnLoadInitialValue = useRef(zoomCountriesOnLoad).current;
  useEffect(() => {
    if (!zoomCountriesOnLoadInitialValue) {
      return;
    }
    const allCountries = highlightedCountries.map((descriptor) => descriptor.countries).flat();
    if (!countriesLoaded && allCountries.length > 0) {
      setCountriesLoaded(true);
      if (mapRef.current) {
        zoomMapToCountries(mapRef.current, allCountries, animateCameraInitialValue);
      } else {
        console.warn(`Couldn't zoom to countries because ref is undefined`);
      }
    }
  }, [
    countriesLoaded,
    highlightedCountries,
    animateCameraInitialValue,
    zoomCountriesOnLoadInitialValue,
  ]);

  return (
    <MapboxContainer
      id={id}
      height={height}
      background="map-background"
      $animate={applyMapMotion}
    />
  );
}

export default withNoSsr(HighlightedCountriesMap);
