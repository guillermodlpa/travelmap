import { Box, Tag } from 'grommet';
import iso from 'iso-3166-1';

const CountryTags: React.FC<{
  countries: string[];
  onRemove: (countryAlpha3: string) => void;
  onSelect: (countryAlpha3: string) => void;
}> = ({ countries, onRemove, onSelect }) => {
  return (
    <Box align="center" direction="row" gap="5px" margin={{ bottom: 'medium' }}>
      {countries
        .map((country) => iso.whereAlpha3(country))
        .filter((countryObject) => Boolean(countryObject))
        .map((countryObject) => (
          <Tag
            value={countryObject!.country}
            key={countryObject!.alpha3}
            onClick={() => onSelect(countryObject!.alpha3)}
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
