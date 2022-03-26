import useSWR, { Fetcher } from 'swr';
import MapList from './MapList';

const fetcher: Fetcher<Array<{ travelMap: TravelMap; users: User[] }>, string> = (url) =>
  fetch(url).then((r) => r.json());
const useRecentMapList = () => {
  const { data, error } = useSWR('/api/maps', fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

const RecentMapsList: React.FC = () => {
  const { mapList } = useRecentMapList();
  return <MapList mapList={mapList} showEditButton={false} />;
};

export default RecentMapsList;
