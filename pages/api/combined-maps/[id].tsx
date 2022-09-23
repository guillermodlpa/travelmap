import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { getPrismaClient } from '../../../lib/prisma';

type ErrorResponse = { error: string };

// DELETE /api/combined-maps/:id
const handleDelete = async (req: NextApiRequest, res: NextApiResponse<{} | ErrorResponse>) => {
  const session = getSession(req, res);
  if (!session) {
    return res.status(500).json({ error: 'Internal error' });
  }

  const id = req.query.id as string;
  if (!id && typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id supplied' });
  }

  const prisma = getPrismaClient();
  const combinedTravelMap = await prisma.combinedTravelMap.findUnique({
    where: { id },
    include: { users: true },
  });
  if (!combinedTravelMap) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!combinedTravelMap.users.some((user) => user.id === session.user[CUSTOM_CLAIM_APP_USER_ID])) {
    return res
      .status(403)
      .json({ error: 'No permission, only users part of a combined map can delete it' });
  }
  await prisma.combinedTravelMap.delete({
    where: { id },
  });
  res.status(200).json({});
};

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<{} | ErrorResponse>) => {
    const handlers: {
      [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
    } = {
      DELETE: handleDelete,
    };
    try {
      return req.method && handlers[req.method]
        ? await handlers[req.method](req, res)
        : res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
    }
  }
);
