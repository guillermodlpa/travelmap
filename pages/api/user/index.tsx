import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import { ManagementClient } from 'auth0';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { getPrismaClient } from '../../../lib/prisma';

type ErrorResponse = { error: string };

// GET /api/user
const handleGet = async (req: NextApiRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const session = getSession(req, res);
  if (session == undefined) {
    return res.status(500).json({ error: 'Internal error' });
  }
  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user[CUSTOM_CLAIM_APP_USER_ID],
    },
  });

  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ error: 'Not found' });
  }
};

// PATCH /api/user
const handlePatch = async (req: NextApiRequest, res: NextApiResponse<User | ErrorResponse>) => {
  const session = getSession(req, res);
  if (session == undefined) {
    return res.status(500).json({ error: 'Internal error' });
  }
  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: session.user[CUSTOM_CLAIM_APP_USER_ID] },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { displayName } = req.body;

  if (typeof displayName !== 'string') {
    return res.status(400).json({ error: 'Invalid displayName' });
  }
  const trimmedDisplayName = displayName.trim();
  if (trimmedDisplayName === '' || trimmedDisplayName.length > 40) {
    return res.status(400).json({ error: 'Invalid displayName' });
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user[CUSTOM_CLAIM_APP_USER_ID] },
    data: {
      displayName: trimmedDisplayName,
      onboarded: true, // we set to true when user saves their settings the first time
    },
  });

  return res.status(200).json(updatedUser);
};

const createAuth0ManagementClient = (): ManagementClient => {
  if (
    !process.env.AUTH0_MTM_BACKEND_DOMAIN ||
    !process.env.AUTH0_MTM_BACKEND_CLIENT_ID ||
    !process.env.AUTH0_MTM_BACKEND_CLIENT_SECRET
  ) {
    throw Error('Missing environment variables');
  }
  return new ManagementClient({
    domain: process.env.AUTH0_MTM_BACKEND_DOMAIN,
    clientId: process.env.AUTH0_MTM_BACKEND_CLIENT_ID,
    clientSecret: process.env.AUTH0_MTM_BACKEND_CLIENT_SECRET,
    scope: 'delete:users',
  });
};

// DELETE /api/user
const handleDelete = async (req: NextApiRequest, res: NextApiResponse<{} | ErrorResponse>) => {
  const session = getSession(req, res);
  if (session == undefined) {
    return res.status(500).json({ error: 'Internal error' });
  }
  const prisma = getPrismaClient();
  const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];

  // Delete all their maps
  await prisma.individualTravelMap.deleteMany({
    where: { userId },
  });
  await prisma.combinedTravelMap.deleteMany({
    where: {
      // Find combinedTravelMaps that one of their related users is the user we're deleting
      users: { some: { id: userId } },
    },
  });

  // Delete user record
  await prisma.user
    .delete({
      where: { id: session.user[CUSTOM_CLAIM_APP_USER_ID] },
    })
    .catch((error) => {
      console.error(error);
      // log the error, but let the execution go through.
    });

  // Auth0 deletion
  const management = createAuth0ManagementClient();
  await management.deleteUser({ id: session.user.sub });

  return res.status(200).json({});
};

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    GET: handleGet,
    PATCH: handlePatch,
    DELETE: handleDelete,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
});
