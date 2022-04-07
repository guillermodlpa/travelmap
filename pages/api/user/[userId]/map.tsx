import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../../../fixtures';
import { getTravelMapFromUser } from '../../../../util/getTravelMapFunctions';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getUserTravelMaps = async (
  req: NextApiRequest,
  res: NextApiResponse<TravelMap | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    // @todo: find if the user exists
    return res.status(400).json({ error: 'Invalid userId supplied' });
  }

  await sleep(1000);

  const user = fixtures.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const response = getTravelMapFromUser(user);

  res.status(200).json(response);
};

export default getUserTravelMaps;
