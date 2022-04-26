import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';
import NoResults from './NoResults';

const fetcher = getFetcher<Array<ClientIndividualTravelMap | ClientCombinedTravelMap>>();

const useRecentMapList = () => {
  const { data, error } = useSWR('/api/recent-maps', fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    error,
  };
};

const RecentMapsList: React.FC = () => {
  const { mapList, isLoading, error } = useRecentMapList();

  if (!mapList && !isLoading && !error) {
    return <NoResults />;
  }

  return <MapList mapList={mapList} allowEdit={false} />;
};

export default RecentMapsList;
