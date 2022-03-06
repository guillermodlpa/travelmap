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
  onRemove: (countryAlpha3: string) => void;
  onSelect: (countryAlpha3: string) => void;
}> = ({ countries, onRemove, onSelect }) => {
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
          // @todo: uncomment this. Make an option to show the X buttons for deleting
          // Note that when onRemove is passed, onClick shouldn't be
          // onRemove={() => onRemove(countryObject!.alpha3)}
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
