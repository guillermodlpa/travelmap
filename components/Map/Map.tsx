import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import iso from 'iso-3166-1';
import { useEffect } from 'react';
import { Box } from 'grommet';

const Map: React.FC = () => {
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_ACCESS_TOKEN || '';
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 0.5, // starting zoom
    });

    map.on('load', function () {
      map.addLayer(
        {
          id: 'country-boundaries',
          source: {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1',
          },
          'source-layer': 'country_boundaries',
          type: 'fill',
          paint: {
            'fill-color': '#d2361e',
            'fill-opacity': 0.4,
          },
        },
        'country-label'
      );

      map.addLayer({
        id: 'country-fills',
        type: 'fill',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        },
        'source-layer': 'country_boundaries',
        layout: {},
        paint: {
          'fill-color': '#fff',
          'fill-opacity': 0, // @todo, figure out a better way
        },
      });

      map.addLayer({
        id: 'country-fills-hover',
        type: 'fill',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        },
        'source-layer': 'country_boundaries',
        layout: {},
        paint: {
          'fill-color': '#627BC1',
          'fill-opacity': 1,
        },
        filter: ['==', 'name', ''],
      });

      // https://github.com/ecrmnn/iso-3166-1/blob/master/src/iso-3166.ts
      const highlightedCountries = [iso.whereCountry('Spain')?.alpha3, iso.whereCountry('France')?.alpha3];

      map.setFilter('country-boundaries', ['in', 'iso_3166_1_alpha_3', ...highlightedCountries]);

      // When the user moves their mouse over the page, we look for features
      // at the mouse position (e.point) and within the states layer (states-fill).
      // If a feature is found, then we'll update the filter in the state-fills-hover
      // layer to only show that state, thus making a hover effect.
      map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });
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

      map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });
        if (features.length) {
          console.log('map click', features[0].properties?.iso_3166_1_alpha_3);
        }
      });
    });

    return () => map.remove(); // @todo: confirm this is the function
  }, []);

  return <Box id="map" height="300px" />;
};

export default Map;
