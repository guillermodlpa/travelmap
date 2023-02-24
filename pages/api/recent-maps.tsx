import type { NextApiRequest, NextApiResponse } from 'next';
import {
  formatApiCombinedTravelMapResponse,
  formatApiIndividualTravelMapResponse,
} from '../../util/formatApiResponse';
import { getPrismaClient } from '../../lib/prisma';

type ErrorResponse = { error: string };

const PAGE_SIZE = 10;

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<Array<ClientIndividualTravelMap | ClientCombinedTravelMap> | ErrorResponse>
) => {
  const prisma = getPrismaClient();

  const individualMapResults = await prisma.individualTravelMap.findMany({
    orderBy: {
      created: 'desc',
    },
    where: {
      visitedCountries: { not: [] },
    },
    take: PAGE_SIZE,
    include: {
      user: true,
    },
  });
  const combinedMapResults = await prisma.combinedTravelMap.findMany({
    orderBy: {
      created: 'desc',
    },
    take: PAGE_SIZE,
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

  const response = allMaps.slice(0, PAGE_SIZE);
  res.setHeader('Cache-Control', 'max-age=0, stale-while-revalidate');
  res.status(200).json(response);
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
