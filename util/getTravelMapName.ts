const getTravelMapNameForUsers = (users: User[]): string =>
  users.length === 1
    ? `${users[0].name}'s Travelmap`
    : `Travelmap of ${users.map(({ name }) => name).join(', ')}`;

export default getTravelMapNameForUsers;
