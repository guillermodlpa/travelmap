import useSWR from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<Array<ClientIndividualTravelMap | ClientCombinedTravelMap>>();

const useRecentMapList = () => {
  const { data, error } = useSWR('/api/recent-maps', fetcher);
  return {
    data,
    loading: !error && !data,
    error,
  };
};

export default useRecentMapList;
