import { List } from 'grommet';
import useSWR, { Fetcher } from 'swr';

interface Map {
  slug: string;
  userDisplayName: string;
}
const fetcher: Fetcher<UserMap[], string> = (url) => fetch(url).then((r) => r.json());
const useMapList = () => {
  const { data, error } = useSWR('/api/map/list', fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

const RecentMapsList: React.FC = () => {
  const { mapList } = useMapList();
  return <List data={mapList.map((map) => ({ name: `${map.userDisplayName}'s Travelmap` }))} />;
};

export default RecentMapsList;
