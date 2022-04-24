import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import MapList from './MapList';

const joinUserNames = (travelMap: ClientCombinedTravelMap | ClientIndividualTravelMap) => {
  if (travelMap.type === 'individual') {
    return travelMap.userDisplayName;
  }
  return travelMap.individualTravelMaps
    .map((individualTravelMap) => individualTravelMap.userDisplayName)
    .reduce(
      (memo, userName, index, { length }) =>
        `${memo}${index === 0 ? '' : index === length - 1 ? ' & ' : ', '}${userName}`,
      ''
    );
};

const CombinedMapsList: React.FC = () => {
  const { mapList, mutate } = useUserCombinedMaps({ shouldFetch: true });

  const handleDelete = (travelMapId: string) =>
    fetch(`/api/combined-maps/${travelMapId}`, {
      method: 'DELETE',
    }).then(() => {
      mutate();
    });

  return (
    <MapList
      mapList={mapList || []}
      allowEdit={false}
      deleteSettings={{
        allowDelete: true,
        getConfirmMessage: (travelMap) => joinUserNames(travelMap),
        handleDelete,
      }}
    />
  );
};

export default CombinedMapsList;
