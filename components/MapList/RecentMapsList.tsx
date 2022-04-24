import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';

const fetcher = getFetcher<Array<ClientIndividualTravelMap | ClientCombinedTravelMap>>();

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
  return <MapList mapList={mapList} allowEdit={false} />;
};

export default RecentMapsList;
