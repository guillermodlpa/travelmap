const travelMaps: TravelMap[] = [
  {
    id: '123u8',
    countries: ['ESP', 'BLZ', 'MAR', 'MYS'],
    slug: 'guillermodlpa',
  },
  {
    id: '89unb',
    countries: ['MYS'],
    slug: 'roro',
  },
  {
    id: 'bu123',
    countries: ['MYS', 'ESP', 'BLZ'],
    slug: 'gmanhalf',
  },
  {
    id: 'bu1222223',
    countries: ['MYS', 'ESP', 'BLZ'],
    slug: 'rupo',
  },
  {
    id: 'aaaabu123',
    countries: ['MYS', 'ESP', 'BLZ'],
    slug: 'sj',
  },
];

const users: LoggedInUser[] = [
  {
    id: 'bausdhasd',
    name: 'Guillermo',
    email: 'g.puente.allott@gmail.com',
  },
  {
    id: '123asdasd',
    name: 'Romane L',
    email: 'roro@gmail.com',
  },
  {
    id: '123asdasdsasd',
    name: 'Misty',
    email: 'misty@gmail.com',
  },
  {
    id: '123asd2222asd',
    name: 'Gman',
    email: 'gman@gmail.com',
  },
];

const fixtures: {
  travelMaps: TravelMap[];
  users: LoggedInUser[];
  userTravelMaps: UserTravelMap[];
} = {
  travelMaps,
  users,
  userTravelMaps: [
    { travelMapId: travelMaps[0].id, userId: users[0].id },
    { travelMapId: travelMaps[1].id, userId: users[1].id },
    { travelMapId: travelMaps[2].id, userId: users[2].id },
    { travelMapId: travelMaps[2].id, userId: users[3].id },
    { travelMapId: travelMaps[3].id, userId: users[3].id },
    { travelMapId: travelMaps[4].id, userId: users[1].id },
    { travelMapId: travelMaps[4].id, userId: users[2].id },
  ],
};

export default fixtures;
