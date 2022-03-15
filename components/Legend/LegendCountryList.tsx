import { Paragraph } from 'grommet';
import { useMemo } from 'react';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';

const LegendCountryList: React.FC<{ countries: string[] }> = ({ countries }) => {
  const countryNames = useMemo<{ [iso3: string]: string }>(
    () =>
      simplifiedWorldAdministrativeBoundaries.reduce(
        (memo, { iso3, name }) =>
          iso3
            ? {
                ...memo,
                [iso3]: name,
              }
            : memo,
        {}
      ),
    []
  );
  return (
    <Paragraph>{countries.map((country) => countryNames[country] || country).join(', ')}</Paragraph>
  );
};

export default LegendCountryList;
