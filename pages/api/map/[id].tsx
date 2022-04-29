import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { formatApiIndividualTravelMapResponse } from '../../../util/formatApiResponse';

type ErrorResponse = { error: string };

// GET /api/map
const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientIndividualTravelMap | ErrorResponse>
) => {
  const id = req.query.id;
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const prisma = new PrismaClient();
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
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    GET: handleGet,
  };
  return req.method && handlers[req.method]
    ? handlers[req.method](req, res)
    : res.status(405).json({ error: 'Method not allowed' });
}
