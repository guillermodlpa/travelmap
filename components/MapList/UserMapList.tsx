import { Text } from 'grommet';
import useUserMap from '../../hooks/useUserMap';
import MapList from './MapList';
import NoResults from './NoResults';

export default function UserMapList() {
  const { map, loading, error } = useUserMap();

  if (!map && !loading && !error) {
    return <NoResults />;
  }

  return (
    <>
      {error && <Text color="status-error">{error.message || 'Error'}</Text>}
      <MapList mapList={map ? [map] : []} allowEdit />
    </>
  );
}
