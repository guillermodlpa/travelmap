import { Button, Box, Avatar, Text, ResponsiveContext, Anchor } from 'grommet';
import NextLink from 'next/link';
import { useContext } from 'react';
import getTravelMapNameForUsers from '../../util/getTravelMapName';
import WrappingDialogConfirmation from '../ConfirmationDialog/WrappingDialogConfirmation';

type MapListProps = {
  allowEdit: boolean;
  mapList: Array<ClientCombinedTravelMap | ClientIndividualTravelMap>;
  deleteSettings?: {
    allowDelete: boolean;
    getConfirmMessage: (travelmap: ClientIndividualTravelMap | ClientCombinedTravelMap) => string;
    handleDelete: (id: string) => Promise<void>;
  };
};

const MapList: React.FC<MapListProps> = ({
  mapList,
  allowEdit,
  deleteSettings = { allowDelete: false, getConfirmMessage: () => '', handleDelete: () => false },
}) => {
  const size = useContext(ResponsiveContext);

  if (!mapList) {
    return null;
  }

  return (
    <Box as="ul" pad="0" margin="0" role="list">
      {mapList.map((travelMap, index) => (
        <Box
          key={travelMap.id}
          pad="small"
          gap="small"
          as="li"
          data-travelmap-id={travelMap.id}
          wrap
          border={{ side: index === 0 ? 'horizontal' : 'bottom', color: 'border', size: '1px' }}
          direction={size === 'small' ? 'column' : 'row'}
        >
          <Box direction="row" gap="small" align="center" flex="grow">
            <Box direction="row" flex={{ shrink: 0 }}>
              {travelMap.type === 'individual' ? (
                <Avatar
                  background="parchment"
                  border={{ color: 'brand', size: 'small' }}
                  src={travelMap.userPictureUrl || undefined}
                >
                  {travelMap.userDisplayName.substring(0, 1)}
                </Avatar>
              ) : (
                travelMap.individualTravelMaps.map((individualTravelMap, index, { length }) => (
                  <Avatar
                    key={individualTravelMap.userId}
                    background="parchment"
                    border={{ color: 'brand', size: 'small' }}
                    margin={{ left: `-${24 * index}px` }}
                    style={{ zIndex: length - index }}
                    src={individualTravelMap.userPictureUrl || undefined}
                  >
                    {individualTravelMap.userDisplayName.substring(0, 1)}
                  </Avatar>
                ))
              )}
            </Box>
            <Box flex={{ grow: 1, shrink: 1 }}>
              <Text>{getTravelMapNameForUsers(travelMap)}</Text>
            </Box>
          </Box>

          <Box key={`action-${travelMap}`} direction="row" gap="small" align="center" justify="end">
            {allowEdit && travelMap.type === 'individual' && (
              <NextLink href={'/map/edit'} passHref>
                <Anchor>Edit</Anchor>
              </NextLink>
            )}

            {deleteSettings.allowDelete && (
              <WrappingDialogConfirmation
                onConfirm={(event, onRequestClose) => {
                  deleteSettings
                    .handleDelete(travelMap.id)
                    .then(() => onRequestClose())
                    .catch((error) => {
                      console.error(error);
                      alert('error');
                    });
                }}
                confirmButtonLabel="Delete Map"
                confirmMessage={deleteSettings.getConfirmMessage(travelMap)}
              >
                {(handleClick) => <Button label="Delete" color="border" onClick={handleClick} />}
              </WrappingDialogConfirmation>
            )}

            <NextLink href={travelMap.pathView} passHref>
              <Anchor>View</Anchor>
            </NextLink>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MapList;
