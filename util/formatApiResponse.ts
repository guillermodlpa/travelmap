import { CombinedTravelMap, IndividualTravelMap, User } from '@prisma/client';

export const formatApiIndividualTravelMapResponse = (
  individualTravelMap: IndividualTravelMap,
  user: User
): ClientIndividualTravelMap => {
  return {
    type: 'individual',
    id: individualTravelMap.id,
    created: individualTravelMap.created.getTime(),
    pathView: `/map/${individualTravelMap.id}`,
    userId: individualTravelMap.userId,
    userDisplayName: user.displayName,
    userPictureUrl: user.pictureUrl,
    visitedCountries: individualTravelMap.visitedCountries as string[],
  };
};

type CombinedTravelMapWithUserAndIndividualMaps = CombinedTravelMap & {
  users: Array<
    User & {
      individualTravelMap: IndividualTravelMap[];
    }
  >;
};

export const formatApiCombinedTravelMapResponse = (
  combinedTravelMap: CombinedTravelMapWithUserAndIndividualMaps
): ClientCombinedTravelMap => {
  return {
    type: 'combined',
    id: combinedTravelMap.id,
    created: combinedTravelMap.created.getTime(),
    pathView: `/map/together/${combinedTravelMap.id}`,
    individualTravelMaps: combinedTravelMap.users.map((user) =>
      formatApiIndividualTravelMapResponse(user.individualTravelMap[0], user)
    ),
  };
};
