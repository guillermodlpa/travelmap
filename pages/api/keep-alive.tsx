import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrismaClient } from '../../lib/prisma';

type ErrorResponse = { error: string };
type SuccessResponse = { individualTravelMapCount: number; combinedTravelMapCount: number };

const handlePut = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) => {
  const keepAliveApiSecret = req.headers['x-keep-alive-api-secret'];
  if (keepAliveApiSecret !== process.env.KEEP_ALIVE_API_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const prisma = getPrismaClient();

  const individualCount = await prisma.individualTravelMap.count({
    where: {
      visitedCountries: { not: [] },
    },
  });
  const combinedCount = await prisma.combinedTravelMap.count();

  await prisma.travelMapCounts.create({
    data: {
      individualTravelMapCount: individualCount,
      combinedTravelMapCount: combinedCount,
    },
  });

  res.status(200).json({
    individualTravelMapCount: individualCount,
    combinedTravelMapCount: combinedCount,
  });
};

/**
 * The keep alive endpoint is hit by a cron
 * It performs a write on the database to keep it awake (Planetscale free plan makes inactive databases sleep)
 * Using this endpoint requires sending a secret in the header `x-keep-alive-api-secret`
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    PUT: handlePut,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
}
