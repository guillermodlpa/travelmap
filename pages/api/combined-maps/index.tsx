import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { formatApiCombinedTravelMapResponse } from '../../../util/formatApiResponse';
import { getPrismaClient } from '../../../lib/prisma';

type ErrorResponse = { error: string };

// POST /api/combined-maps
const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientCombinedTravelMap | ErrorResponse>
) => {
  const session = getSession(req, res);
  if (!session) {
    return res.status(500).json({ error: 'Internal error' });
  }

  const { otherUserId } = req.body;
  if (otherUserId && typeof otherUserId !== 'string') {
    return res.status(400).json({ error: 'Invalid otherUserId supplied' });
  }

  const prisma = getPrismaClient();
  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
  });
  if (!otherUser) {
    return res.status(404).json({ error: 'Internal error: other user not found' });
  }

  const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];
  const combinedTravelMapResult = await prisma.combinedTravelMap.create({
    data: {
      users: {
        connect: otherUserId ? [{ id: userId }, { id: otherUserId }] : [{ id: userId }],
      },
    },
    include: {
      users: {
        include: {
          individualTravelMap: true,
        },
      },
    },
  });

  const combinedTravelMapResponse = formatApiCombinedTravelMapResponse(combinedTravelMapResult);

  res.status(200).json(combinedTravelMapResponse);
};

// GET /api/combined-maps
const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientCombinedTravelMap[] | ErrorResponse>
) => {
  const session = getSession(req, res);
  if (!session) {
    return res.status(500).json({ error: 'Internal error' });
  }

  const { otherUserId } = req.query;
  if (otherUserId && typeof otherUserId !== 'string') {
    return res.status(400).json({ error: 'Invalid otherUserId supplied' });
  }

  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      auth0Sub: session.user.sub,
    },
    include: {
      combinedTravelMaps: {
        where: otherUserId ? { users: { some: { id: otherUserId } } } : {},
        include: {
          users: {
            include: {
              individualTravelMap: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(500).json({ error: 'Internal error: user not found' });
  }

  const combinedTravelMaps = (user.combinedTravelMaps || []).map((combinedMapResult) =>
    formatApiCombinedTravelMapResponse(combinedMapResult)
  );

  res.status(200).json(combinedTravelMaps);
};

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    POST: handlePost,
    GET: handleGet,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
});
