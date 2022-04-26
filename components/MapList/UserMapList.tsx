import useUserMap from '../../hooks/useUserMap';
import MapList from './MapList';

const UserMapList: React.FC = () => {
  const { map } = useUserMap();
  return <MapList mapList={map ? [map] : []} allowEdit />;
};

export default UserMapList;
