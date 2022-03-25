import { Button, List } from 'grommet';
import NextLink from 'next/link';
import useSWR, { Fetcher } from 'swr';
import getTravelMapNameForUsers from '../../util/getTravelMapName';

const fetcher: Fetcher<Array<{ travelMap: TravelMap; users: User[] }>, string> = (url) =>
  fetch(url).then((r) => r.json());
const useMapList = () => {
  const { data, error } = useSWR('/api/maps', fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

const RecentMapsList: React.FC = () => {
  const { mapList } = useMapList();
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
        <NextLink key={`action-${item.travelMapId}`} href={`/map/${item.slug}`} passHref>
          <Button label="View" />
        </NextLink>
      )}
    />
  );
};

export default RecentMapsList;
