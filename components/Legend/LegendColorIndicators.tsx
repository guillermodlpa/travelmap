import { Box, Button, Text } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import React, { useState } from 'react';

type LegendItem = {
  id: string;
  color: string;
  label: string;
  subItems?: Array<{ id: string; label: string }>;
};

function LegendColorIndicator({
  label,
  color,
  subItems,
  forceExpanded = false,
}: LegendItem & { forceExpanded?: boolean }) {
  const [subItemsExpanded, setSubItemsExpanded] = useState<boolean>(false);
  return (
    <Box direction="column" gap="xsmall" flex={{ shrink: 0 }}>
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
                <Text size="small">{subItem.label}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function LegendColorIndicators({
  data,
  forceExpanded = false,
}: {
  data: LegendItem[];
  forceExpanded?: boolean;
}) {
  return (
    <Box pad={{ left: 'small' }} gap="xsmall">
      {data.map((item: LegendItem) => (
        <LegendColorIndicator key={item.id} {...item} forceExpanded={forceExpanded} />
      ))}
    </Box>
  );
}
