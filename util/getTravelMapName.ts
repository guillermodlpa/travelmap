const getTravelMapName = (travelMap: TravelMap): string =>
  travelMap.users.length === 1
    ? `${travelMap.users[0].name}'s Travelmap`
    : `Travelmap of ${travelMap.users.map(({ name }) => name).join(', ')}`;

export default getTravelMapName;
