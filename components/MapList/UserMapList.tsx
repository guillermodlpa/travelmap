import useUserMap from '../../hooks/useUserMap';
import MapList from './MapList';
import NoResults from './NoResults';

const UserMapList: React.FC = () => {
  const { map, isLoading, error } = useUserMap();

  if (!map && !isLoading && !error) {
    return <NoResults />;
  }

  return <MapList mapList={map ? [map] : []} allowEdit />;
};

export default UserMapList;
