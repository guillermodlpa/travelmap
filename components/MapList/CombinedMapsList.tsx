import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import MapList from './MapList';

const CombinedMapsList: React.FC<{ userId: string; allowDelete: boolean }> = ({
  userId,
  allowDelete,
}) => {
  const { mapList } = useUserCombinedMaps(userId);
  return (
    <MapList mapList={mapList || []} allowEdit={false} allowDelete={allowDelete} userId={userId} />
  );
};

export default CombinedMapsList;
