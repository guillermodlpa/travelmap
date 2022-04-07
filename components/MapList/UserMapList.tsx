import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';

const fetcher = getFetcher<TravelMap>();

const useUserMaps = (userId: string) => {
  const { data, error } = useSWR(`/api/user/${userId}/map`, fetcher, { suspense: true });
  console.log({ data, error });
  return {
    map: data,
    isLoading: !error && data != null,
    isError: error,
  };
};

const UserMapList: React.FC<{ userId: string }> = ({ userId }) => {
  const { map } = useUserMaps(userId);
  return <MapList mapList={map ? [map] : []} showEditButton />;
};

const withUserIdRequired = (Component: React.FC<{ userId: string }>) => {
  const WithUserIdRequired: React.FC<{ userId: string }> = ({ userId, ...props }) => {
    if (!userId) {
      return <>Error</>;
    }
    return <Component userId={userId} {...props} />;
  };
  return WithUserIdRequired;
};
export default withUserIdRequired(UserMapList);
