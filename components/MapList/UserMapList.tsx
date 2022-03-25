import { Button, List, Box } from 'grommet';
import NextLink from 'next/link';
import useSWR, { Fetcher } from 'swr';
import getTravelMapNameForUsers from '../../util/getTravelMapName';

const fetcher: Fetcher<Array<{ travelMap: TravelMap; users: User[] }>, string> = (url) =>
  fetch(url).then((r) => r.json());
const useUserMaps = (userId: string) => {
  const { data, error } = useSWR(`/api/user/${userId}/maps`, fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

const UserMapList: React.FC<{ userId: string }> = ({ userId }) => {
  const { mapList } = useUserMaps(userId);
  return (
    <List
      primaryKey="name"
      itemKey="travelMapId"
      data={mapList.map(({ travelMap, users }) => ({
        travelMapId: travelMap.id,
        name: getTravelMapNameForUsers(users),
        slug: travelMap.slug,
      }))}
      defaultItemProps={{ wrap: true }}
      action={(item) => (
        <Box key={`action-${item}`} direction="row" gap="small">
          <NextLink href={`/map/${item.travelMapId}/edit`} passHref>
            <Button label="Edit" />
          </NextLink>

          <NextLink href={`/map/${item.slug}`} passHref>
            <Button label="View" />
          </NextLink>
        </Box>
      )}
    />
  );
};

export default UserMapList;
