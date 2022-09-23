import useSWR from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<ClientIndividualTravelMap>();

const useIndividualMap = (id: string | undefined) => {
  const { data, error } = useSWR(id ? `/api/map/${id}?type=individual` : null, fetcher);
  return {
    data,
    loading: !error && data == null,
    error: error,
  };
};

export default useIndividualMap;
