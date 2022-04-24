import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { formatApiCombinedTravelMapResponse } from '../../../util/formatApiResponse';

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

  const prisma = new PrismaClient();
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
        connect: [{ id: userId }, { id: otherUserId }],
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

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      auth0Sub: session.user.sub,
    },
    include: {
      combinedTravelMaps: {
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
  return req.method && handlers[req.method]
    ? handlers[req.method](req, res)
    : res.status(405).json({ error: 'Method not allowed' });
});
