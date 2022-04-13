import useSWR from 'swr';
import getFetcher from '../util/fetcher';

const fetcher = getFetcher<TravelMap[]>();

const getUrl = (userId: string | null, otherUserId?: string | undefined): string | null => {
  if (userId === null) {
    return null;
  }
  return otherUserId
    ? `/api/user/${userId}/combined-maps?otherUserId=${otherUserId}`
    : `/api/user/${userId}/combined-maps`;
};

const useUserCombinedMaps = (userId: string | null, otherUserId?: string | undefined) => {
  const { data, error } = useSWR(getUrl(userId, otherUserId), fetcher);
  return {
    mapList: !error ? data : undefined,
    loading: !error && data == null,
    error: error ? data : undefined,
  };
};

export default useUserCombinedMaps;
