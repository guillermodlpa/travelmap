import { Box, Button, Text } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import React, { useState } from 'react';

type LegendItem = {
  id: string;
  color: string;
  label: string;
  subItems?: Array<{ id: string; label: string }>;
};

const LegendColorIndicator: React.FC<LegendItem & { forceExpanded?: boolean }> = ({
  label,
  color,
  subItems,
  forceExpanded = false,
}) => {
  const [subItemsExpanded, setSubItemsExpanded] = useState<boolean>(false);
  return (
    <Box direction="column" gap="xsmall">
      <Box direction="row" gap="small" align="center">
        <Box width="1rem" height="1rem" border background={color} />
        <Text>{label}</Text>
        {subItems && !forceExpanded && (
          <Button
            size="small"
            a11yTitle="Show or hide list of countries"
            icon={subItemsExpanded ? <FormUp /> : <FormDown />}
            onClick={() => setSubItemsExpanded(!subItemsExpanded)}
          />
        )}
      </Box>
      {(subItemsExpanded || forceExpanded) && (
        <Box animation={['fadeIn']}>
          <Box
            as="ul"
            pad="none"
            margin={{ vertical: 'xsmall', horizontal: 'none' }}
            style={{ listStylePosition: 'inside', display: 'block', columnCount: 2 }}
          >
            {subItems?.map((subItem) => (
              <Box
                as="li"
                key={subItem.id}
                pad={{ left: '24px' }}
                style={{ display: 'list-item', textIndent: '-24px' }}
              >
                {subItem.label}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const LegendColorIndicators: React.FC<{ data: LegendItem[]; forceExpanded?: boolean }> = ({
  data,
  forceExpanded = false,
}) => (
  <Box pad={{ left: 'small' }} gap="xsmall">
    {data.map((item: LegendItem) => (
      <LegendColorIndicator key={item.id} {...item} forceExpanded={forceExpanded} />
    ))}
  </Box>
);

export default LegendColorIndicators;
