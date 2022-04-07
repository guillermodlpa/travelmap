import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';

const fetcher = getFetcher<TravelMap[]>();

const useUserMaps = (userId: string) => {
  const { data, error } = useSWR(`/api/user/${userId}/combined-maps`, fetcher, { suspense: true });
  return {
    mapList: !error ? data || [] : [],
    loading: !error && data == null,
    error: error ? data : undefined,
  };
};

const CombinedMapsList: React.FC<{ userId: string }> = ({ userId }) => {
  const { mapList } = useUserMaps(userId);
  return <MapList mapList={mapList} showEditButton />;
};

export default CombinedMapsList;
