import { Button, List, Box, Avatar, Text, ResponsiveContext } from 'grommet';
import NextLink from 'next/link';
import { useContext } from 'react';
import getTravelMapNameForUsers from '../../util/getTravelMapName';

const MapList: React.FC<{
  showEditButton: boolean;
  mapList: Array<{ travelMap: TravelMap; users: User[] }>;
}> = ({ mapList, showEditButton }) => {
  const size = useContext(ResponsiveContext);
  console.log('size', size);
  return (
    <Box as="ul" pad="0" margin="0" role="list">
      {mapList.map((item, index) => (
        <Box
          key={item.travelMap.id}
          pad="small"
          gap="small"
          as="li"
          wrap
          border={{ side: index === 0 ? 'horizontal' : 'bottom', color: 'border', size: '1px' }}
          direction={size === 'small' ? 'column' : 'row'}
        >
          <Box direction="row" gap="small" align="center" flex="grow">
            <Box direction="row" flex={{ shrink: 0 }}>
              {item.users.map((user, index) => (
                <Avatar
                  key={user.id}
                  background="paper"
                  border={{ color: 'brand', size: 'small' }}
                  margin={{ left: `-${24 * index}px` }}
                  style={{ zIndex: item.users.length - index }}
                >
                  {user.name.substring(0, 1)}
                </Avatar>
              ))}
            </Box>
            <Box flex={{ grow: 1, shrink: 1 }}>
              <Text>{getTravelMapNameForUsers(item.users)}</Text>
            </Box>
          </Box>

          <Box key={`action-${item}`} direction="row" gap="small" align="center" justify="end">
            {showEditButton && (
              <NextLink href={`/map/${item.travelMap.id}/edit`} passHref>
                <Button label="Edit" />
              </NextLink>
            )}

            <NextLink href={`/map/${item.travelMap.slug}`} passHref>
              <Button label="View" />
            </NextLink>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MapList;
