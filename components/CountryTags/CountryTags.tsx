import { Box, Tag } from 'grommet';
import iso from 'iso-3166-1';

const CountryTags: React.FC<{ countries: string[] }> = ({ countries }) => {
  return (
    <Box align="center" direction="row" gap="5px">
      {countries
        .map((country) => iso.whereAlpha3(country))
        .filter((countryObject) => Boolean(countryObject))
        .map((countryObject) => (
          <Tag value={countryObject!.country} key={countryObject!.alpha3} />
        ))}
    </Box>
  );
};

export default CountryTags;
