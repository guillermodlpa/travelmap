import { Box, Text } from 'grommet';
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
        `${memo}${index === 0 ? '' : index === length - 1 ? ' & ' : ', '}${userName}`,
      ''
    );
};

export default function CombinedMapsList() {
  const { mapList, mutate } = useUserCombinedMaps({ shouldFetch: true });

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
}
