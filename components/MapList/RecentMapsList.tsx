import { Text } from 'grommet';
import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';
import NoResults from './NoResults';

const fetcher = getFetcher<Array<ClientIndividualTravelMap | ClientCombinedTravelMap>>();

const useRecentMapList = () => {
  const { data, error } = useSWR('/api/recent-maps', fetcher);
  return {
    mapList: data || [],
    loading: !error && !data,
    error,
  };
};

export default function RecentMapsList() {
  const { mapList, loading, error } = useRecentMapList();

  if (!mapList && !loading && !error) {
    return <NoResults />;
  }

  return (
    <>
      {error && <Text color="status-error">{error.message || 'Error'}</Text>}
      <MapList mapList={mapList} allowEdit={false} />
    </>
  );
}
