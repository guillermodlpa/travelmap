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
  expandedInitially = false,
}: LegendItem & { expandedInitially?: boolean }) {
  const [subItemsExpanded, setSubItemsExpanded] = useState<boolean>(expandedInitially);
  return (
    <Box direction="column" pad={{ bottom: 'small' }}>
      <Box direction="row" align="center" flex={{ shrink: 0 }}>
        <Box width="1rem" height="1rem" margin={{ right: 'small' }} border background={color} />
        <Text>{label}</Text>
        {subItems && (
          <Button
            size="small"
            margin={{ left: 'xsmall' }}
            // secondary
            a11yTitle="Show or hide list of countries"
            icon={subItemsExpanded ? <FormUp /> : <FormDown />}
            onClick={() => setSubItemsExpanded(!subItemsExpanded)}
          />
        )}
      </Box>
      {subItemsExpanded && (
        <Box animation={['fadeIn']} overflow="auto">
          <Box
            as="ul"
            pad="none"
            margin={{ bottom: 'xsmall', horizontal: 'none', top: 'none' }}
            style={{ listStylePosition: 'inside', display: 'block', columnCount: 2 }}
          >
            {subItems?.map((subItem) => (
              <Box
                as="li"
                key={subItem.id}
                pad={{ left: '24px' }}
                style={{ display: 'list-item', textIndent: '-24px' }}
                data-code={subItem.id}
                width={{ max: '150px' }}
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
  expandedInitially = false,
}: {
  data: LegendItem[];
  expandedInitially?: boolean;
}) {
  return (
    <Box pad={{ left: 'small' }}>
      {data.map((item: LegendItem) => (
        <LegendColorIndicator key={item.id} {...item} expandedInitially={expandedInitially} />
      ))}
    </Box>
  );
}
