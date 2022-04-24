import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import {
  formatApiCombinedTravelMapResponse,
  formatApiIndividualTravelMapResponse,
} from '../../util/formatApiResponse';

type ErrorResponse = { error: string };

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<ClientIndividualTravelMap | ClientCombinedTravelMap> | ErrorResponse>
) => {
  const prisma = new PrismaClient();

  const individualMapResults = await prisma.individualTravelMap.findMany({
    orderBy: {
      created: 'desc',
    },
    where: {
      visitedCountries: { not: [] },
    },
    take: 5,
    include: {
      user: true,
    },
  });
  const combinedMapResults = await prisma.combinedTravelMap.findMany({
    orderBy: {
      created: 'desc',
    },
    take: 5,
    include: {
      users: {
        include: {
          individualTravelMap: true,
        },
      },
    },
  });

  const individualTravelMaps: ClientIndividualTravelMap[] = individualMapResults.map(
    (individualMapResult) =>
      formatApiIndividualTravelMapResponse(individualMapResult, individualMapResult.user)
  );
  const combinedTravelMaps: ClientCombinedTravelMap[] = combinedMapResults.map(
    (combinedMapResult) => formatApiCombinedTravelMapResponse(combinedMapResult)
  );

  const allMaps = [...individualTravelMaps, ...combinedTravelMaps];
  allMaps.sort((a, b) => (b.created && a.created ? b.created - a.created : 0));

  const response = allMaps.slice(0, 5);
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
