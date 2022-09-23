import useSWR from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<ClientCombinedTravelMap>();

const useCombinedMap = (id: string | undefined) => {
  const { data, error } = useSWR(id ? `/api/map/${id}?type=combined` : null, fetcher);
  return {
    data,
    loading: !error && data == null,
    error: error,
  };
};

export default useCombinedMap;
