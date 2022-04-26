import useSWR from 'swr';
import getFetcher from '../util/fetcher';

const fetcher = getFetcher<ClientIndividualTravelMap>();

const useUserMap = () => {
  const { data, error } = useSWR(`/api/map`, fetcher);
  return {
    map: data,
    isLoading: !error && data != null,
    error: error,
  };
};

export default useUserMap;
