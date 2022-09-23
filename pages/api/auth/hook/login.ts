import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../../../../lib/prisma';

const hasInitialMap = (prisma: PrismaClient, userId: string) =>
  Boolean(
    prisma.individualTravelMap.findFirst({
      where: { userId },
    })
  );

const createInitialMap = (prisma: PrismaClient, userId: string) =>
  prisma.individualTravelMap.create({
    data: {
      userId,
      visitedCountries: [],
    },
  });

/**
 * Handles the hook request coming from Auth0 when a user logs in.
 * It uses a secret that is kept as an env var here and an env var there to ensure sender can perform this action.
 * This hook creates a user record in the DB, and returns the user that has the new ID in the database, so that Auth0 can save it as well.
 */
const loginHookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, sub, pictureUrl, secret } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (secret !== process.env.AUTH0_ACTIONS_HOOK_SECRET) {
    return res.status(400).json({ error: 'Invalid secret' });
  }
  if (!email) {
    return res.status(400).json({ error: 'No email provided' });
  }
  if (!sub) {
    return res.status(400).json({ error: 'No sub provided' });
  }

  const prisma = getPrismaClient();

  // Check if we had any user with this same sub. If we did, we can assume it's
  // the same user and they already registered, but for some reason, their app user ID didn't  save in Auth0
  const preExistingUser = await prisma.user.findUnique({
    where: { auth0Sub: sub },
  });
  if (preExistingUser) {
    if (!(await hasInitialMap(prisma, preExistingUser.id))) {
      await createInitialMap(prisma, preExistingUser.id);
    }
    return res.status(200).json(preExistingUser);
  }

  const userPictureUrl =
    typeof pictureUrl === 'string' && !pictureUrl.includes('cdn.auth0.com') ? pictureUrl : null;

  return prisma.user
    .create({
      data: {
        auth0Sub: sub,
        email,
        displayName: '', // we prompt users to fill this out right after they sign up
        pictureUrl: userPictureUrl,
        onboarded: false,
      },
    })
    .then(async (user) => {
      await createInitialMap(prisma, user.id);
      return res.status(200).json(user);
    })
    .catch(async (error) => {
      console.error(error);
      return res.status(500).json({ error: 'prisma', prismaError: error.toString() });
    });
};

export default loginHookHandler;
