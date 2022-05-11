import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from 'grommet';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import withNoSsr from '../NoSsr/withNoSsr';
import { HeightType } from 'grommet/utils';
import { useThemeMode } from '../ThemeModeContext/ThemeModeContext';
import styled, { useTheme } from 'styled-components';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';
import mapStyles from './mapStyles';
import getCountryName from '../../util/getCountryName';

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
        'fill-opacity': 1,
      },
    },
    MAPBOX_STUDIO_LAYER_ANCHOR
  );
  map.setFilter(id, ['in', 'iso_3166_1_alpha_3']); // none selected initially
};

const updateMapHighlightedCountries = (
  map: mapboxgl.Map,
  highlightedCountries: HighlighterCountriesDescriptor[]
) => {
  highlightedCountries.forEach((descriptor) => {
    map.setFilter(descriptor.id, ['in', 'iso_3166_1_alpha_3', ...descriptor.countries]);
  });
};

type Bounds = [number, number, number, number];

const zoomMapToCountries = (
  map: mapboxgl.Map,
  countries: string[],
  animate: boolean,
  padding: ZoomPadding
) => {
  if (countries.length === 0) {
    return;
  }
  const filteredBoundaries = simplifiedWorldAdministrativeBoundaries
    .filter(({ iso3 }) => iso3 && countries.includes(iso3))
    .filter(({ iso3 }) => iso3 && !['ATA'].includes(iso3))
    .filter(({ bounds }) => bounds != undefined);
  const bounds = filteredBoundaries.map(({ bounds }) => bounds) as Bounds[];

  const overarchingBounds: Bounds = [
    Math.min(...bounds.map((bound) => bound[0])),
    Math.min(...bounds.map((bound) => bound[1])),
    Math.max(...bounds.map((bound) => bound[2])),
    Math.max(...bounds.map((bound) => bound[3])),
  ];

  try {
    map.fitBounds(overarchingBounds, {
      padding: {
        top: padding.top ?? 0,
        bottom: padding.bottom ?? 0,
        left: padding.left ?? 0,
        right: padding.right ?? 0,
      },
      duration: animate ? 5000 : 0,
    });
  } catch (error) {
    // it can happen when the country goes out of bounds, like Antartica
    console.error(error);
  }
};

const addCountryHoverInteractivity = (
  map: mapboxgl.Map,
  fillColor: string,
  showHoveredCountryFill: boolean,
  onCountryClicked: (code: string) => void,
  onCountryHovered: (param: undefined | { code: string; name: string }) => void
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
  if (showHoveredCountryFill) {
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
  }

  // When the user moves their mouse over the page, we look for features
  // at the mouse position (e.point) and within the states layer (countries-fill).
  // If a feature is found, then we'll update the filter in the state-fills-hover
  // layer to only show that state, thus making a hover effect.
  map.on(
    'mousemove',
    throttle((e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });

      const currentHoveredFeatureId = showHoveredCountryFill
        ? map.getFilter('country-fills-hover')?.[2]
        : undefined;

      if (features.length && currentHoveredFeatureId !== features[0].properties?.name) {
        map.getCanvas().style.cursor = 'pointer';
        const code = features[0].properties?.iso_3166_1_alpha_3;
        onCountryHovered({ code, name: getCountryName(code) || code });
        if (showHoveredCountryFill) {
          map.setFilter('country-fills-hover', ['==', 'name', features[0].properties?.name]);
        }
      } else if (features.length === 0) {
        map.getCanvas().style.cursor = '';
        onCountryHovered(undefined);
        if (showHoveredCountryFill) {
          map.setFilter('country-fills-hover', ['==', 'name', '']);
        }
      }
    }, 50)
  );

  // Reset the country-fills-hover layer's filter when the mouse leaves the map
  map.on(
    'mouseout',
    debounce(() => {
      map.getCanvas().style.cursor = 'auto';
      onCountryHovered(undefined);
      if (showHoveredCountryFill) {
        map.setFilter('country-fills-hover', ['==', 'name', '']);
      }
    }, 100)
  );

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

export type HighlighterCountriesDescriptor = { id: string; countries: string[]; color: string };

type ZoomPadding = { top?: number; bottom?: number; left?: number; right?: number };

type HighlighedCountriesMapProps = {
  height?: HeightType;
  id: string;
  interactive: boolean;
  applyMapMotion: boolean;
  animateCamera: boolean;
  zoomCountriesOnLoad: boolean;
  scrollZoom?: boolean;
  highlightedCountries?: HighlighterCountriesDescriptor[];
  initialZoomPadding?: ZoomPadding;
  countriesAreInteractive: boolean;
  showHoveredCountryFill: boolean;
  onCountrySelected?: (code: string) => void;
  onCountryHovered?: (param: undefined | { code: string; name: string }) => void;
};

function HighlightedCountriesMap({
  height = '100%',
  id,
  interactive,
  applyMapMotion = false,
  animateCamera = true,
  zoomCountriesOnLoad = false,
  initialZoomPadding = { top: 0, bottom: 0, left: 0, right: 0 },
  highlightedCountries = [],
  countriesAreInteractive,
  showHoveredCountryFill,
  scrollZoom = true,
  onCountrySelected = () => {},
  onCountryHovered = () => {},
}: HighlighedCountriesMapProps) {
  const { mode } = useThemeMode();
  const mapboxStyle = mapStyles[mode || 'light'];
  const mapRef = useRef<mapboxgl.Map>();
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const theme = useTheme();

  const interactiveRef = useRef(interactive);
  const scrollZoomRef = useRef(scrollZoom);
  const countriesAreInteractiveRef = useRef(countriesAreInteractive);
  const showHoveredCountryFillRef = useRef(showHoveredCountryFill);
  const onCountrySelectedRef = useRef(onCountrySelected);
  const onCountryHoveredRef = useRef(onCountryHovered);
  const themeRef = useRef(theme);
  const initialZoomPaddingRef = useRef(initialZoomPadding);
  const highlightedCountriesRef = useRef(highlightedCountries);

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
        interactive: interactiveRef.current,
        doubleClickZoom: false,
        scrollZoom: scrollZoomRef.current,
        minZoom: 0.5,
      });

      map.on('load', (event) => {
        // include the information of country boundaries
        event.target.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });
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
  }, [mapboxStyle, id]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) {
      return;
    }
    highlightedCountriesRef.current.forEach((descriptor) => {
      const color =
        (themeRef.current.global.colors[descriptor.color] as string) || descriptor.color;
      if (descriptor.id.includes('undefined')) {
        console.warn('Mapbox layer ID might use an undefined value', descriptor.id);
      }
      addLayerToMap(map, descriptor.id, color);
    });
    if (countriesAreInteractiveRef.current) {
      addCountryHoverInteractivity(
        map,
        themeRef.current.global.colors.border[themeRef.current.dark ? 'dark' : 'light'],
        showHoveredCountryFillRef.current,
        onCountrySelectedRef.current,
        onCountryHoveredRef.current
      );
    }
  }, [mapLoaded]);

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

  const zoomDone = useRef(false);
  const animateCameraRef = useRef(animateCamera);
  const zoomCountriesOnLoadRef = useRef(zoomCountriesOnLoad);

  // when we change the color mode, we reset this flag so we re-zoom
  useEffect(() => {
    zoomDone.current = false;
  }, [mapboxStyle]);

  useEffect(() => {
    if (!zoomCountriesOnLoadRef.current) {
      return;
    }
    const allCountries = highlightedCountries.map((descriptor) => descriptor.countries).flat();
    if (!zoomDone.current && allCountries.length > 0) {
      if (mapRef.current) {
        zoomMapToCountries(
          mapRef.current,
          allCountries,
          animateCameraRef.current,
          initialZoomPaddingRef.current
        );
        // we only want to animate the camera on zoom the first time
        // Any subsequent zoom call to all countries should be direct, like changing color theme mode
        zoomDone.current = true;
        animateCameraRef.current = false;
      } else {
        console.warn(`Couldn't zoom to countries because ref is undefined`);
      }
    }
  }, [highlightedCountries, mapboxStyle]);

  return (
    <MapboxContainer
      id={id}
      height={height}
      background="map-background"
      overflow="hidden"
      $animate={applyMapMotion}
    />
  );
}

export default withNoSsr(HighlightedCountriesMap);
