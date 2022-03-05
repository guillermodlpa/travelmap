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

      // https://github.com/ecrmnn/iso-3166-1/blob/master/src/iso-3166.ts
      const highlightedCountries = [iso.whereCountry('Spain')?.alpha3, iso.whereCountry('France')?.alpha3];

      map.setFilter('country-boundaries', ['in', 'iso_3166_1_alpha_3', ...highlightedCountries]);
    });

    return () => map.remove(); // @todo: confirm this is the function
  }, []);

  return <Box id="map" height="300px" />;
};

export default Map;
