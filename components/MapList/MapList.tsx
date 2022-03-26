import { Button, List, Box, Avatar, Text } from 'grommet';
import NextLink from 'next/link';
import getTravelMapNameForUsers from '../../util/getTravelMapName';

const MapList: React.FC<{
  showEditButton: boolean;
  mapList: Array<{ travelMap: TravelMap; users: User[] }>;
}> = ({ mapList, showEditButton }) => (
  <List
    itemKey={(item) => item.travelMap.id}
    data={mapList}
    defaultItemProps={{ wrap: true }}
    action={(item) => (
      <Box key={`action-${item}`} direction="row" gap="small">
        {showEditButton && (
          <NextLink href={`/map/${item.travelMap.id}/edit`} passHref>
            <Button label="Edit" />
          </NextLink>
        )}

        <NextLink href={`/map/${item.travelMap.slug}`} passHref>
          <Button label="View" />
        </NextLink>
      </Box>
    )}
  >
    {(item: { users: User[]; travelMap: TravelMap }) => (
      <Box direction="row" gap="small" align="center">
        <Box direction="row">
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
        <Box flex="grow">
          <Text>{getTravelMapNameForUsers(item.users)}</Text>
        </Box>
      </Box>
    )}
  </List>
);

export default MapList;
