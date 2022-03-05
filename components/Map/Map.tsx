import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from 'grommet';

/**
 * This JSON file is a simplification of the World Administrative Boundaries dataset
 * We use it to know the min and max lng and lat for each country, so we can move the camera to them
 *
 * Dataset in GeoJSON format can be downloaded from:
 * https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries/export/
 */
import simplifiedWorldAdministrativeBoundaries from './simplified-world-administrative-boundaries.json';

const Map: React.FC<{
  highlightedCountries: string[];
  onCountryClicked: (country: string) => void;
  countryZoomedInto: string | undefined;
}> = ({ highlightedCountries, onCountryClicked, countryZoomedInto }) => {
  const mapRef = useRef<mapboxgl.Map>();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 1, // starting zoom
    });

    map.on('load', function () {
      map.addSource('countryBoundariesV1', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: 'countryBoundariesV1',
        'source-layer': 'country_boundaries',
        layout: {},
        paint: {
          'fill-color': '#fff',
          'fill-opacity': 0, // @todo, figure out a better way
        },
      });

      map.addLayer(
        {
          id: 'country-fills-hover',
          type: 'fill',
          source: 'countryBoundariesV1',
          'source-layer': 'country_boundaries',
          layout: {},
          paint: {
            'fill-color': '#627BC1',
            'fill-opacity': 1,
          },
          filter: ['==', 'name', ''],
        },
        'country-label'
      );

      map.addLayer(
        {
          id: 'highlighted-countries',
          source: 'countryBoundariesV1',
          'source-layer': 'country_boundaries',
          type: 'fill',
          paint: {
            'fill-color': '#d2361e',
            'fill-opacity': 0.4,
          },
        },
        'country-label'
      );

      // https://github.com/ecrmnn/iso-3166-1/blob/master/src/iso-3166.ts
      map.setFilter('highlighted-countries', ['in', 'iso_3166_1_alpha_3']);

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

      // map.on('click', function (e) {
      //   const features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });
      //   const country = features.length ? features[0].properties?.iso_3166_1_alpha_3 : null;
      //   if (country) {
      //     onCountryClicked(country);
      //   }
      // });

      mapRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // @todo: confirm this is the function
        mapRef.current = undefined;
      }
    };
  }, []);

  const onClick = useCallback(
    (e) => {
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

  useEffect(() => {
    if (mapLoaded) {
      mapRef.current?.on('click', onClick);
      return () => {
        mapRef.current?.off('click', onClick);
      };
    }
  }, [onClick, mapLoaded]);

  useEffect(() => {
    if (mapLoaded) {
      // https://github.com/ecrmnn/iso-3166-1/blob/master/src/iso-3166.ts
      mapRef.current?.setFilter('highlighted-countries', [
        'in',
        'iso_3166_1_alpha_3',
        ...highlightedCountries,
      ]);
    }
  }, [highlightedCountries, mapLoaded]);

  useEffect(() => {
    if (mapLoaded && countryZoomedInto) {
      const descriptor = simplifiedWorldAdministrativeBoundaries.find(
        ({ iso3 }) => iso3 === countryZoomedInto
      );
      if (descriptor?.bounds) {
        mapRef.current?.fitBounds(descriptor?.bounds as [number, number, number, number]);
      }
    }
  }, [countryZoomedInto, mapLoaded]);

  return <Box id="map" flex="grow" />;
};

export default Map;
