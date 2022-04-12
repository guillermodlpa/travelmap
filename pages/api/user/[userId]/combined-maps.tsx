import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../../../fixtures';
import { getTravelMapFromCombinedMap } from '../../../../util/getTravelMapFunctions';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getUserCombinedMaps = async (
  req: NextApiRequest,
  res: NextApiResponse<TravelMap[] | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId, otherUserId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid userId supplied' });
  }
  if (otherUserId && typeof otherUserId !== 'string') {
    return res.status(400).json({ error: 'Invalid otherUserId supplied' });
  }

  const user = fixtures.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await sleep(500);

  const travelMaps = fixtures.combinedMaps
    .filter((combinedMap) => combinedMap.userIds.includes(userId))
    .filter((combinedMap) => !otherUserId || combinedMap.userIds.includes(otherUserId))
    .map((combinedMap) => getTravelMapFromCombinedMap(combinedMap));

  res.status(200).json(travelMaps);
};

export default getUserCombinedMaps;
