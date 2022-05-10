const NBSP_CHAR = '\u00A0';

const getTravelMapName = (
  travelMap: ClientIndividualTravelMap | ClientCombinedTravelMap,
  { includeAppName = false } = {}
): string => {
  if (travelMap.type === 'individual') {
    return !includeAppName
      ? travelMap.userDisplayName
      : /s$/i.test(travelMap.userDisplayName)
      ? `${travelMap.userDisplayName}' Travelmap`
      : `${travelMap.userDisplayName}'s Travelmap`;
  }

  const nameString = travelMap.individualTravelMaps
    .map((individualTravelMap) => individualTravelMap.userDisplayName.replace(/\s/g, NBSP_CHAR))
    .reduce(
      (memo, name, index, { length }) =>
        `${memo}${index === 0 ? '' : index < length - 1 ? ', ' : ' and '}${name}`,
      ''
    );

  return !includeAppName ? nameString : `Travelmap of ${nameString}`;
};

export default getTravelMapName;
