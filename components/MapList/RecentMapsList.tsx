import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';

const fetcher = getFetcher<TravelMap[]>();

const useRecentMapList = () => {
  const { data, error } = useSWR('/api/recent-maps', fetcher, { suspense: true });
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
