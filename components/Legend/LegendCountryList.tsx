import { Anchor, Avatar, Box, Paragraph } from 'grommet';
import React, { ReactNode, useMemo } from 'react';
import NextLink from 'next/link';
import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';

const LegendCountryList: React.FC<{
  prefix?: ReactNode | undefined;
  sufix?: ReactNode | undefined;
  countries: string[];
  pathEdit?: string | undefined;
}> = ({ prefix, countries, pathEdit, sufix }) => {
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

  const editLink = pathEdit ? (
    <NextLink href={pathEdit} passHref>
      <Anchor>Edit</Anchor>
    </NextLink>
  ) : null;

  return (
    <Paragraph margin={'0'}>
      {prefix}
      {countries.map((country) => countryNames[country] || country).join(', ')}
      {editLink ? '. ' : ''}
      {editLink}
      {sufix}
    </Paragraph>
  );
};

export default LegendCountryList;
