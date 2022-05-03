import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { Box, ResponsiveContext, ThemeContext } from 'grommet';

import withNoSsr from '../NoSsr/withNoSsr';

/**
 * This JSON file is a simplification of the World Administrative Boundaries dataset
 * We use it to know the min and max lng and lat for each country, so we can move the camera to them
 *
 * Dataset in GeoJSON format can be downloaded from:
 * https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries/export/
 */
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';
import { DefaultTheme } from 'styled-components';

const MAP_BACKGROUND_COLOR = 'rgb(101, 196, 236)';
const INITIAL_MAP_CENTER: [number, number] = [25, 20];
const INITIAL_MAP_ZOOM = 1;
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v11';

const getIncrementalId = (() => {
  let lastId = 0;
  return () => {
    lastId = lastId + 1;
    return lastId;
  };
})();

const useUniqueId = (prefix = '') => {
  const idRef = useRef<string>();
  if (idRef.current === undefined) {
    idRef.current = `${prefix}${getIncrementalId()}`;
  }
  return idRef.current;
};

function Map({
  visitedCountries,
  onCountryClicked,
  countryZoomedInto,
}: {
  visitedCountries: string[];
  onCountryClicked: (country: string) => void;
  countryZoomedInto: string | undefined;
}) {
  const mapRef = useRef<mapboxgl.Map>();
  const [mapLoaded, setMapLoaded] = useState(false);
  const uniqueMapId = useUniqueId('map_');

  const theme = useContext(ThemeContext) as DefaultTheme;

  useEffect(() => {
    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';

      const map = new mapboxgl.Map({
        container: uniqueMapId, // @todo: change this for something random
        style: MAPBOX_STYLE,
        center: INITIAL_MAP_CENTER,
        zoom: INITIAL_MAP_ZOOM,
        localFontFamily: "'Roboto', sans-serif",
        doubleClickZoom: false,
      });

      map.on('load', function () {
        map.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
          })
        );

        // include the information of country boundaries
        map.addSource('countryBoundariesV1', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        });

        // add a transparent layer of countries. We use it when interacting with the map to know
        // which country it is
        map.addLayer({
          id: 'country-fills',
          type: 'fill',
          source: 'countryBoundariesV1',
          'source-layer': 'country_boundaries',
          layout: {},
          paint: {
            'fill-color': '#fff',
            'fill-opacity': 0,
          },
        });

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
              'fill-color': theme.global.colors['status-ok'] || 'green',
              'fill-opacity': 0.5,
            },
            filter: ['==', 'name', ''],
          },
          'country-label'
        );

        // add a layer of visited countries
        map.addLayer(
          {
            id: 'visited-countries',
            source: 'countryBoundariesV1',
            'source-layer': 'country_boundaries',
            type: 'fill',
            paint: {
              'fill-color': theme.global.colors.brand.light || 'black',
              'fill-opacity': 0.5,
            },
          },
          'country-label'
        );

        // for now, we set the filter without any countries
        map.setFilter('visited-countries', ['in', 'iso_3166_1_alpha_3']);

        // When the user moves their mouse over the page, we look for features
        // at the mouse position (e.point) and within the states layer (states-fill).
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
        map.on('mouseout', function () {
          map.getCanvas().style.cursor = 'auto';
          map.setFilter('country-fills-hover', ['==', 'name', '']);
        });

        mapRef.current = map;
        setMapLoaded(true);
      });

      return () => {
        if (mapRef.current) {
          setMapLoaded(false);
          mapRef.current.remove(); // @todo: confirm this is the function
          mapRef.current = undefined;
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, [uniqueMapId]);

  const onClick = useCallback(
    (e: mapboxgl.MapLayerEventType['click'] & mapboxgl.EventData) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['country-fills'],
      });
      const country =
        features && features.length ? features[0].properties?.iso_3166_1_alpha_3 : null;
      if (country) {
        onCountryClicked(country);
      }
    },
    [onCountryClicked]
  );

  // Handles the click event, which depends on an external callback
  useEffect(() => {
    if (mapLoaded) {
      mapRef.current?.on('click', onClick);
      return () => {
        mapRef.current?.off('click', onClick);
      };
    }
  }, [onClick, mapLoaded]);

  // Updates the visited countries higlighted in the map
  useEffect(() => {
    if (mapLoaded) {
      mapRef.current?.setFilter('visited-countries', [
        'in',
        'iso_3166_1_alpha_3',
        ...visitedCountries,
      ]);
    }
  }, [visitedCountries, mapLoaded]);

  // Moves the map camera to a specific country when `countryZoomedInto` changes
  useEffect(() => {
    if (mapLoaded && countryZoomedInto) {
      const descriptor = simplifiedWorldAdministrativeBoundaries.find(
        ({ iso3 }) => iso3 === countryZoomedInto
      );
      if (descriptor?.bounds) {
        mapRef.current?.fitBounds(descriptor?.bounds as [number, number, number, number]);
      } else {
        console.log(`Bounds not found for ${countryZoomedInto}`, descriptor);
      }
    }
  }, [countryZoomedInto, mapLoaded]);

  const size = useContext(ResponsiveContext);
  useEffect(() => {
    // fix map resizing when toggling responsive mode when developing with dev tools
    if (process.env.NODE_ENV === 'development') {
      const timeout = setTimeout(() => {
        mapRef.current?.resize();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [size]);

  return <Box id={uniqueMapId} flex="grow" background={MAP_BACKGROUND_COLOR} />;
}

export default withNoSsr(Map);
