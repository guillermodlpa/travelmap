import useSWR from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<ClientIndividualTravelMap>();

const useUserMap = () => {
  const { data, error } = useSWR(`/api/map`, fetcher);
  return {
    map: data,
    loading: !error && data == null,
    error: error,
  };
};

export default useUserMap;
