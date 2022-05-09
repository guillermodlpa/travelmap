const NBSP_CHAR = '\u00A0';

const getTravelMapName = (
  travelMap: ClientIndividualTravelMap | ClientCombinedTravelMap
): string => {
  if (travelMap.type === 'individual') {
    return travelMap.userDisplayName;
  }

  const nameString = travelMap.individualTravelMaps
    .map((individualTravelMap) => individualTravelMap.userDisplayName.replace(/\s/g, NBSP_CHAR))
    .reduce(
      (memo, name, index, { length }) =>
        `${memo}${index === 0 ? '' : index < length - 1 ? ', ' : ' and '}${name}`,
      ''
    );

  return nameString;
};

export default getTravelMapName;
