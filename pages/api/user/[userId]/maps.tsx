import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../../../fixtures';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getMapListHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404);
  }
  const { userId } = req.query;
  if (!userId) {
    // @todo: find if the user exists
    return res.status(404);
  }

  await sleep(1000);

  const userMaps = fixtures.userTravelMaps
    .filter((userTravelMap) => userTravelMap.userId === userId)
    .map((userTravelMap) =>
      fixtures.travelMaps.find((travelMap) => travelMap.id === userTravelMap.travelMapId)
    )
    .map((travelMap) => travelMap as TravelMap);

  const response: Array<{ users: User[]; travelMap: TravelMap }> = userMaps.map((travelMap) => ({
    travelMap,
    users: fixtures.userTravelMaps
      .filter((userTravelMap) => userTravelMap.travelMapId === travelMap.id)
      .map((userTravelMap) => fixtures.users.find((user) => user.id === userTravelMap.userId))
      .filter((user) => user !== undefined)
      .map((user) => user as User),
  }));

  res.status(200).json(response);
};

export default getMapListHandler;
