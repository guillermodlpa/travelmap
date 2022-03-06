import { Select, SelectExtendedProps } from 'grommet';
import { useState } from 'react';

export interface Option {
  label: string;
  value: string;
}
interface SearchableSelectProps extends SelectExtendedProps {
  options: Option[];
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onChange, ...rest }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  return (
    <Select
      {...rest}
      options={filteredOptions}
      onChange={(...args) => {
        if (onChange) {
          onChange(...args);
        }
        setFilteredOptions(options);
      }}
      onSearch={(text) => {
        // The line below escapes regular expression special characters: [ \ ^ $ . | ? * + ( )
        const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        const exp = new RegExp(escapedText, 'i');
        setFilteredOptions(
          options.filter(({ label }) => typeof label === 'string' && exp.test(label))
        );
      }}
    />
  );
};

export default SearchableSelect;
