import iso from 'iso-3166-1';
import SearchableSelect from './SearchableSelect';

const CountrySearch: React.FC<{
  onCountrySelected: (countryAlpha3: string) => void;
  disabledCountries: string[];
}> = ({ onCountrySelected, disabledCountries }) => (
  <SearchableSelect
    options={iso
      .all()
      .map((countryObject) => ({ label: countryObject.country, value: countryObject.alpha3 }))}
    labelKey="label"
    disabled={disabledCountries}
    valueKey="value"
    value={''}
    dropHeight="small"
    placeholder="Add country"
    a11yTitle="Add country"
    onChange={({ option }) => {
      onCountrySelected(option.value);
    }}
  />
);

export default CountrySearch;
