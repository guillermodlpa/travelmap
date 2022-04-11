import { Button, Box, Avatar, Text, ResponsiveContext } from 'grommet';
import NextLink from 'next/link';
import { useContext } from 'react';
import getTravelMapNameForUsers from '../../util/getTravelMapName';
import WrappingDialogConfirmation from '../ConfirmationDialog/WrappingDialogConfirmation';

const getOtherUserNames = (users: User[], userId: string | undefined): string[] =>
  users.filter((user) => user.id !== userId).map((user) => user.name);

const joinUserNames = (userNames: string[]) =>
  userNames.reduce(
    (memo, userName, index) =>
      `${memo}${index === 0 ? '' : index === userNames.length - 1 ? ' & ' : ', '}${userName}`,
    ''
  );

type MapListProps = {
  allowEdit: boolean;
  mapList: TravelMap[];
  userId?: string;
} & ({ allowDelete: false } | { allowDelete: true; userId: string });

const MapList: React.FC<MapListProps> = ({ mapList, allowEdit, allowDelete, userId }) => {
  const size = useContext(ResponsiveContext);

  if (!mapList) {
    return null;
  }

  return (
    <Box as="ul" pad="0" margin="0" role="list">
      {mapList.map((travelMap, index) => (
        <Box
          key={`${travelMap.type}--${travelMap.id}`}
          pad="small"
          gap="small"
          as="li"
          wrap
          border={{ side: index === 0 ? 'horizontal' : 'bottom', color: 'border', size: '1px' }}
          direction={size === 'small' ? 'column' : 'row'}
        >
          <Box direction="row" gap="small" align="center" flex="grow">
            <Box direction="row" flex={{ shrink: 0 }}>
              {travelMap.users.map((user, index) => (
                <Avatar
                  key={user.id}
                  background="parchment"
                  border={{ color: 'brand', size: 'small' }}
                  margin={{ left: `-${24 * index}px` }}
                  style={{ zIndex: travelMap.users.length - index }}
                >
                  {user.name.substring(0, 1)}
                </Avatar>
              ))}
            </Box>
            <Box flex={{ grow: 1, shrink: 1 }}>
              <Text>{getTravelMapNameForUsers(travelMap)}</Text>
            </Box>
          </Box>

          <Box key={`action-${travelMap}`} direction="row" gap="small" align="center" justify="end">
            {allowEdit && travelMap.pathEdit && (
              <NextLink href={travelMap.pathEdit} passHref>
                <Button label="Edit" />
              </NextLink>
            )}

            {allowDelete && travelMap.pathEdit && (
              <WrappingDialogConfirmation
                onConfirm={() => {
                  alert('deleted');
                }}
                confirmButtonLabel="Delete Map"
                confirmMessage={`Are you sure you want to delete your map together with ${joinUserNames(
                  getOtherUserNames(travelMap.users, userId)
                )}? This will make the map disappear for them too.`}
              >
                {(handleClick) => <Button label="Delete" color="border" onClick={handleClick} />}
              </WrappingDialogConfirmation>
            )}

            <NextLink href={travelMap.pathView} passHref>
              <Button label="View" />
            </NextLink>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MapList;
