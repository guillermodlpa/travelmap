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

  const response = [
    getTravelMapFromUser(fixtures.users[0]),
    getTravelMapFromUser(fixtures.users[1]),
    getTravelMapFromCombinedMap(fixtures.combinedMaps[0]),
    getTravelMapFromCombinedMap(fixtures.combinedMaps[1]),
    getTravelMapFromCombinedMap(fixtures.combinedMaps[2]),
  ];

  res.status(200).json(response);
};

export default getRecentTravelMaps;
