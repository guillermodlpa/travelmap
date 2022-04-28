import { Text } from 'grommet';
import useUserCombinedMaps from '../../hooks/useUserCombinedMaps';
import MapList from './MapList';
import NoResults from './NoResults';

const joinUserNames = (travelMap: ClientCombinedTravelMap | ClientIndividualTravelMap) => {
  if (travelMap.type === 'individual') {
    return travelMap.userDisplayName;
  }
  return travelMap.individualTravelMaps
    .map((individualTravelMap) => individualTravelMap.userDisplayName)
    .reduce(
      (memo, userName, index, { length }) =>
        `${memo}${index === 0 ? '' : index === length - 1 ? ' and ' : ', '}${userName}`,
      ''
    );
};

export default function CombinedMapsList() {
  const { mapList, mutate, error } = useUserCombinedMaps({ shouldFetch: true });

  const handleDelete = (travelMapId: string) =>
    fetch(`/api/combined-maps/${travelMapId}`, {
      method: 'DELETE',
    }).then(() => {
      mutate();
    });

  if (mapList && mapList.length === 0) {
    return <NoResults />;
  }

  return (
    <>
      {error && <Text color="status-error">{error.message || 'Error'}</Text>}
      <MapList
        mapList={mapList || []}
        allowEdit={false}
        deleteSettings={{
          allowDelete: true,
          getConfirmMessage: (travelMap) =>
            `Are you sure about deleting the together map of ${joinUserNames(travelMap)}?`,
          handleDelete,
        }}
      />
    </>
  );
}
