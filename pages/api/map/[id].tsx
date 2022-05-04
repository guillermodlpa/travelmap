import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {
  formatApiCombinedTravelMapResponse,
  formatApiIndividualTravelMapResponse,
} from '../../../util/formatApiResponse';

type ErrorResponse = { error: string };

// GET /api/map/:id?type=[individual | combined]
const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientIndividualTravelMap | ClientCombinedTravelMap | ErrorResponse>
) => {
  const id = req.query.id;
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const prisma = new PrismaClient();

  const type = req.query.type;

  if (type === 'individual') {
    const individualTravelMap = await prisma.individualTravelMap.findFirst({
      where: { id },
      include: { user: true },
    });
    if (!individualTravelMap) {
      return res.status(404).json({ error: 'Not found' });
    }
    const response = formatApiIndividualTravelMapResponse(
      individualTravelMap,
      individualTravelMap.user
    );
    res.status(200).json(response);
  } else if (type === 'combined') {
    const combinedTravelMap = await prisma.combinedTravelMap.findFirst({
      where: { id },
      include: {
        users: {
          include: {
            individualTravelMap: true,
          },
        },
      },
    });
    if (!combinedTravelMap) {
      return res.status(404).json({ error: 'Not found' });
    }
    const response = formatApiCombinedTravelMapResponse(combinedTravelMap);
    res.status(200).json(response);
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    GET: handleGet,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
}
