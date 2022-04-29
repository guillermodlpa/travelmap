import { Text } from 'grommet';
import useRecentMapList from '../../hooks/useRecentMaps';
import MapList from './MapList';
import NoResults from './NoResults';

export default function RecentMapsList() {
  const { data, loading, error } = useRecentMapList();

  if (data && data.length === 0) {
    return <NoResults />;
  }

  return (
    <>
      {error && <Text color="status-error">{error.message || 'Error'}</Text>}

      <MapList mapList={data || []} allowEdit={false} />
    </>
  );
}
