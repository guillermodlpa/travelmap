import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../fixtures';
import {
  getTravelMapFromCombinedMap,
  getTravelMapFromUser,
} from '../../util/getTravelMapFunctions';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getRecentTravelMaps = async (
  req: NextApiRequest,
  res: NextApiResponse<TravelMap[] | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await sleep(1000);

  // @todo: return recent maps

  const allMaps = [
    ...fixtures.users.map((user) => getTravelMapFromUser(user)),
    ...fixtures.combinedMaps.map((combinedMap) => getTravelMapFromCombinedMap(combinedMap)),
  ];
  const response = allMaps.slice(0, 5);
  response.sort(() => 0.5 - Math.random()); // shuffle
  res.status(200).json(response);
};

export default getRecentTravelMaps;
