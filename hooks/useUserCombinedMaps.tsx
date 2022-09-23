import { useUser } from '@auth0/nextjs-auth0';
import useSWR from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<Array<ClientCombinedTravelMap>>();

const getUrl = (otherUserId?: string | null): string | null => {
  return otherUserId ? `/api/combined-maps?otherUserId=${otherUserId}` : `/api/combined-maps`;
};

const useUserCombinedMaps = ({
  otherUserId,
  shouldFetch = true,
}: {
  otherUserId?: string | null;
  shouldFetch: boolean;
}) => {
  const url = getUrl(otherUserId);

  const { user: auth0User } = useUser();
  const { data, error, mutate } = useSWR(auth0User && shouldFetch ? url : null, fetcher);

  return {
    mapList: !error ? data : undefined,
    loading: !error && data == null,
    error,
    mutate,
  };
};

export default useUserCombinedMaps;
