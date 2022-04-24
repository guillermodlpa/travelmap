import { Paragraph } from 'grommet';
import React, { ReactNode, useMemo } from 'react';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';

const LegendCountryList: React.FC<{
  prefix?: ReactNode | undefined;
  sufix?: ReactNode | undefined;
  countries: string[];
}> = ({ prefix, countries, sufix }) => {
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
    <Paragraph margin={'0'}>
      {prefix}
      {countries.map((country) => countryNames[country] || country).join(', ')}
      {sufix}
    </Paragraph>
  );
};

export default LegendCountryList;
