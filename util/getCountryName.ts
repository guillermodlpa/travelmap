/**
 * This JSON file is a simplification of the World Administrative Boundaries dataset
 * We use it to know the min and max lng and lat for each country, so we can move the camera to them
 *
 * Dataset in GeoJSON format can be downloaded from:
 * https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries/export/
 */
import simplifiedWorldAdministrativeBoundaries from './simplified-world-administrative-boundaries.json';

const unlistedAndOverrides: { [iso3: string]: string } = {
  XKS: 'Kosovo',
  GBR: 'United Kingdom',
  IRN: 'Iran',
  ATA: 'Antarctica',
};

const iso3ToName: { [iso3: string]: string } = simplifiedWorldAdministrativeBoundaries.reduce(
  (memo, { iso3, name }) =>
    iso3
      ? {
          ...memo,
          [iso3]: name,
        }
      : memo,
  {}
);

export default function getCountryName(iso3Code: string): string | undefined {
  return unlistedAndOverrides[iso3Code] || iso3ToName[iso3Code] || iso3Code;
}
