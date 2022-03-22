const fixtures: {
  userMapsBySlug: { [slug: string]: UserMap };
} = {
  userMapsBySlug: {
    guillermodlpa: {
      id: '123u8',
      userDisplayName: 'Guillermo',
      countries: ['ESP', 'BLZ', 'MAR', 'MYS'],
      slug: 'guillermodlpa',
    },
    roro: {
      id: '89unb',
      userDisplayName: 'Roro',
      countries: ['MYS'],
      slug: 'roro',
    },
  },
};

export default fixtures;
