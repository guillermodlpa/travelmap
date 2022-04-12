const NBSP_CHAR = '\u00A0';

const getTravelMapName = (travelMap: TravelMap): string =>
  travelMap.users.length === 1
    ? `${travelMap.users[0].name}'s Travelmap`
    : `Travelmap of ${travelMap.users
        .map(({ name }) => name.replace(/\s/g, NBSP_CHAR))
        .join(', ')}`;

export default getTravelMapName;
