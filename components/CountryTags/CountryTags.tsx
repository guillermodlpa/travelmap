import { Box, Tag } from 'grommet';

import simplifiedWorldAdministrativeBoundaries from '../../constants/simplified-world-administrative-boundaries.json';

const iso3ToCountryName: { [iso3: string]: string } = simplifiedWorldAdministrativeBoundaries
  .filter((descriptor) => Boolean(descriptor.iso3))
  .reduce(
    (memo, descriptor) => ({
      ...memo,
      [descriptor.iso3!]: descriptor.name,
    }),
    {}
  );

const CountryTags: React.FC<{
  countries: string[];
  onSelect: (countryAlpha3: string) => void;
}> = ({ countries, onSelect }) => {
  return (
    <Box
      align="center"
      direction="row"
      margin={{ bottom: 'medium' }}
      style={{ gap: '10px 5px' }}
      wrap
    >
      {countries.map((countryIso3) => (
        <Tag
          value={iso3ToCountryName[countryIso3] || countryIso3}
          key={countryIso3}
          onClick={() => onSelect(countryIso3)}
        />
      ))}

      {/* if we have no tags, we render a transparent one so that we have the equivalent height */}
      {countries.length === 0 && (
        <div style={{ opacity: 0 }}>
          <Tag value="&nbsp;" aria-hidden="true" />
        </div>
      )}
    </Box>
  );
};

export default CountryTags;
