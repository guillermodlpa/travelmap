/**
 * This script helps to turn the 9MG GeoJSON file with all world country and territory boundaries
 * into a 31 KB file with precisely that we need, the min and max lng and lat for each place,
 * so that we can move the map view to any country because we know its boundaries.
 *
 * Dataset in GeoJSON format can be downloaded from:
 * https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries/export/
 */
(() => {
  const fs = require('fs');

  const flattenCoordinates = (coordinates) => {
    if (Array.isArray(coordinates[0][0] ?? undefined)) {
      return flattenCoordinates(coordinates.flat());
    }
    // already an array of numbers
    else {
      return coordinates;
    }
  };
  const getBoundaries = (coordinates) => {
    const lngs = coordinates.map(([lng]) => lng);
    const lats = coordinates.map(([lng, lat]) => lat);

    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
  };

  function parse() {
    const data = fs.readFileSync('./scripts/world-administrative-boundaries.geojson');
    const jsonData = JSON.parse(data);
    const parsed = jsonData.features.map((feature) => ({
      name: feature.properties.name,
      iso3: feature.properties.iso3,
      bounds: getBoundaries(flattenCoordinates(feature.geometry.coordinates)),
    }));

    fs.writeFileSync(
      './scripts/simplified-world-administrative-boundaries.geojson',
      JSON.stringify(parsed)
    );
  }

  parse();
})();
