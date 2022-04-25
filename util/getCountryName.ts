import simplifiedWorldAdministrativeBoundaries from './simplified-world-administrative-boundaries.json';

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
  return iso3ToName[iso3Code];
}
