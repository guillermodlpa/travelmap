import useSWR from 'swr';
import getFetcher from '../util/fetcher';

const fetcher = getFetcher<ClientIndividualTravelMap>();

const useUserMap = () => {
  const { data, error } = useSWR(`/api/map`, fetcher, { suspense: true });
  return {
    map: data,
    isLoading: !error && data != null,
    isError: error,
  };
};

export default useUserMap;
