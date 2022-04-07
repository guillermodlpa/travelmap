import fixtures from '../fixtures';

export const getTravelMapFromUser = (user: UserDatabaseEntity): TravelMap => {
  return {
    type: 'user',
    id: user.id,
    pathView: `/map/${user.id}`,
    pathEdit: `/map/${user.id}/edit`,
    users: [
      {
        id: user.id,
        name: user.name,
        visitedCountries: user.visitedCountries,
      },
    ],
  };
};

export const getTravelMapFromCombinedMap = (combinedMap: CombinedMapDatabaseEntity): TravelMap => {
  return {
    type: 'multiple-user',
    id: combinedMap.id,
    pathView: `/mmap/${combinedMap.id}`,
    pathEdit: `/mmap/${combinedMap.id}/edit`,
    users: combinedMap.userIds
      .map((userId) => fixtures.users.find((user) => user.id === userId))
      .filter((user) => user !== null)
      .map((user) => user as User)
      .map((user) => ({
        id: user.id,
        name: user.name,
        visitedCountries: user.visitedCountries,
      })),
  };
};
