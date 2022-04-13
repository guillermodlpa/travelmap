const users: LoggedInUser[] = [
  {
    id: 'bausdhasd',
    name: 'Guillermo',
    visitedCountries: ['ESP', 'BLZ', 'MAR'],
    email: 'g.puente.allott@gmail.com',
    created: new Date(),
  },
  {
    id: '123asdasd',
    name: 'Romane L',
    visitedCountries: ['MYS', 'ESP'],
    email: 'roro@gmail.com',
    created: new Date(),
  },
  {
    id: '123asdasdsasd',
    name: 'Misty',
    visitedCountries: ['MYS', 'ESP', 'BLZ'],
    email: 'misty@gmail.com',
    created: new Date(),
  },
  {
    id: '123asd2222asd',
    name: 'Gman',
    visitedCountries: ['MYS', 'ESP', 'BLZ'],
    email: 'gman@gmail.com',
    created: new Date(),
  },
];

const combinedMaps = [
  {
    id: 'u192312bnaa',
    userIds: [users[0].id, users[1].id],
    created: new Date(),
  },
  {
    id: 'u192312bnaa_1',
    userIds: [users[0].id, users[2].id],
    created: new Date(),
  },
  {
    id: 'u192312bnaa_2',
    userIds: [users[1].id, users[2].id],
    created: new Date(),
  },
  {
    id: 'u192312bnaa_3',
    userIds: [users[2].id, users[3].id],
    created: new Date(),
  },
];

const fixtures: {
  users: UserDatabaseEntity[];
  combinedMaps: CombinedMapDatabaseEntity[];
} = {
  users,
  combinedMaps,
};

export default fixtures;
