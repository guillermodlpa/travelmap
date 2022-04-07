import type { NextApiRequest, NextApiResponse } from 'next';
import fixtures from '../../../../fixtures';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid userId supplied' });
  }

  await sleep(1000);

  const getPublicUser = ({ email, created, ...user }: LoggedInUser): User => ({ ...user });

  const user = fixtures.users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const publicUser = getPublicUser(user);
  res.status(200).json(publicUser);
};

export default getUser;
