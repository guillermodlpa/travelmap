import { useMemo } from 'react';
import SearchableSelect, { Option } from './SearchableSelect';

import simplifiedWorldAdministrativeBoundaries from '../../constants/simplified-world-administrative-boundaries.json';

const CountrySearch: React.FC<{
  onCountrySelected: (countryAlpha3: string) => void;
  disabledCountries: string[];
}> = ({ onCountrySelected, disabledCountries }) => {
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
      value={disabledCountries}
      dropHeight="small"
      placeholder="Add country"
      a11yTitle="Add country"
      multiple
      onChange={({ option }) => {
        onCountrySelected(option.value);
      }}
    />
  );
};

export default CountrySearch;
