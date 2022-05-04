import useSWR from 'swr';
import getFetcher from '../util/fetcher';

const fetcher = getFetcher<ClientCombinedTravelMap>();

const useCombinedMap = (id: string) => {
  const { data, error } = useSWR(`/api/map/${id}?type=combined`, fetcher);
  return {
    map: data,
    loading: !error && data == null,
    error: error,
  };
};

export default useCombinedMap;
