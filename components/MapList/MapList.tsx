import { Button, Box, Avatar, Text, ResponsiveContext } from 'grommet';
import NextLink from 'next/link';
import { useContext } from 'react';
import getTravelMapNameForUsers from '../../util/getTravelMapName';

const MapList: React.FC<{
  allowEdit: boolean;
  allowDelete: boolean;
  mapList: TravelMap[];
}> = ({ mapList, allowEdit, allowDelete }) => {
  const size = useContext(ResponsiveContext);

  if (!mapList) {
    return null;
  }

  return (
    <Box as="ul" pad="0" margin="0" role="list">
      {mapList.map((travelMap, index) => (
        <Box
          key={`${travelMap.type}--${travelMap.id}`}
          pad="small"
          gap="small"
          as="li"
          wrap
          border={{ side: index === 0 ? 'horizontal' : 'bottom', color: 'border', size: '1px' }}
          direction={size === 'small' ? 'column' : 'row'}
        >
          <Box direction="row" gap="small" align="center" flex="grow">
            <Box direction="row" flex={{ shrink: 0 }}>
              {travelMap.users.map((user, index) => (
                <Avatar
                  key={user.id}
                  background="parchment"
                  border={{ color: 'brand', size: 'small' }}
                  margin={{ left: `-${24 * index}px` }}
                  style={{ zIndex: travelMap.users.length - index }}
                >
                  {user.name.substring(0, 1)}
                </Avatar>
              ))}
            </Box>
            <Box flex={{ grow: 1, shrink: 1 }}>
              <Text>{getTravelMapNameForUsers(travelMap)}</Text>
            </Box>
          </Box>

          <Box key={`action-${travelMap}`} direction="row" gap="small" align="center" justify="end">
            {allowEdit && travelMap.pathEdit && (
              <NextLink href={travelMap.pathEdit} passHref>
                <Button label="Edit" />
              </NextLink>
            )}

            {allowDelete && travelMap.pathEdit && <Button label="Delete" color="border" />}

            <NextLink href={travelMap.pathView} passHref>
              <Button label="View" />
            </NextLink>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MapList;
