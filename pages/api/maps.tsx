import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../fixtures';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getMapListHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404);
  }

  await sleep(1000);

  const recentTravelMaps = fixtures.travelMaps.slice(-4).reverse();

  const response: Array<{ users: User[]; travelMap: TravelMap }> = recentTravelMaps.map(
    (recentTravelMap) => ({
      travelMap: recentTravelMap,
      users: fixtures.userTravelMaps
        .filter((userTravelMap) => userTravelMap.travelMapId === recentTravelMap.id)
        .map((userTravelMap) => fixtures.users.find((user) => user.id === userTravelMap.userId))
        .filter((user) => user !== undefined)
        .map((user) => user as User),
    })
  );

  res.status(200).json(response);
};

export default getMapListHandler;
