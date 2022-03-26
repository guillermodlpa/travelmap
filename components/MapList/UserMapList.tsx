import useSWR, { Fetcher } from 'swr';
import MapList from './MapList';

const fetcher: Fetcher<Array<{ travelMap: TravelMap; users: User[] }>, string> = (url) =>
  fetch(url).then((r) => r.json());
const useUserMaps = (userId: string) => {
  const { data, error } = useSWR(`/api/user/${userId}/maps`, fetcher, { suspense: true });
  return {
    mapList: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

const UserMapList: React.FC<{ userId: string }> = ({ userId }) => {
  const { mapList } = useUserMaps(userId);
  return <MapList mapList={mapList} showEditButton />;
};

export default UserMapList;
