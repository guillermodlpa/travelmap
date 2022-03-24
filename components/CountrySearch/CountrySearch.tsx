import { useMemo } from 'react';
import SearchableSelect, { Option } from './SearchableSelect';

import simplifiedWorldAdministrativeBoundaries from '../../util/simplified-world-administrative-boundaries.json';
import { Box, CheckBox, Text } from 'grommet';

const CountrySearch: React.FC<{
  onCountrySelected: (countryAlpha3: string) => void;
  selectedCountries: string[];
}> = ({ onCountrySelected, selectedCountries }) => {
  const options = useMemo(
    () =>
      simplifiedWorldAdministrativeBoundaries
        .map((countryObject) => ({
          label: countryObject.name,
          value: countryObject.iso3,
        }))
        .filter(({ value }) => value !== undefined)
        .sort(({ label: nameA }, { label: nameB }) => nameA.localeCompare(nameB)) as Option[],
    []
  );

  return (
    <SearchableSelect
      options={options}
      labelKey="label"
      valueKey="value"
      value={selectedCountries}
      dropHeight="medium"
      placeholder="Select countries"
      searchPlaceholder="Search countries"
      emptySearchMessage="No results"
      a11yTitle="Select countries"
      multiple
      closeOnChange={false}
      onChange={({ option }) => {
        onCountrySelected(option.value);
      }}
    >
      {({ label, value }: Option) => (
        <Box direction="row" align="center" pad="small" background="popup" flex={false}>
          <CheckBox
            tabIndex={-1}
            checked={selectedCountries.some((country) => country === value)}
            label={<Text size="medium">{label}</Text>}
            onChange={() => {}}
          />
        </Box>
      )}
    </SearchableSelect>
  );
};

export default CountrySearch;
