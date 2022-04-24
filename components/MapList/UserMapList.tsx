import useSWR from 'swr';
import getFetcher from '../../util/fetcher';
import MapList from './MapList';

const fetcher = getFetcher<ClientIndividualTravelMap>();

const useUserMaps = () => {
  const { data, error } = useSWR(`/api/map`, fetcher, { suspense: true });
  return {
    map: data,
    isLoading: !error && data != null,
    isError: error,
  };
};

const UserMapList: React.FC = () => {
  const { map } = useUserMaps();
  return <MapList mapList={map ? [map] : []} allowEdit />;
};

export default UserMapList;
