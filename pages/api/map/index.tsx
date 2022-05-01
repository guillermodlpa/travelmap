import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { formatApiIndividualTravelMapResponse } from '../../../util/formatApiResponse';

type ErrorResponse = { error: string };

const isVisitedCountriesValid = (visitedCountries: string[]): boolean =>
  Array.isArray(visitedCountries) &&
  visitedCountries.every((visitedCountry) => typeof visitedCountry === 'string');

// GET /api/map
const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientIndividualTravelMap | ErrorResponse>
) => {
  const session = getSession(req, res);
  if (!session) {
    return res.status(500).json({ error: 'Internal error' });
  }

  const prisma = new PrismaClient();
  const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];

  const individualTravelMap = await prisma.individualTravelMap.findFirst({
    where: { userId },
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

// PATCH /api/map
const handlePatch = async (
  req: NextApiRequest,
  res: NextApiResponse<ClientIndividualTravelMap | ErrorResponse>
) => {
  const session = getSession(req, res);
  if (!session) {
    return res.status(500).json({ error: 'Internal error' });
  }
  const prisma = new PrismaClient();
  const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];
  const individualTravelMap = await prisma.individualTravelMap.findFirst({
    where: { userId },
    include: { user: true },
  });
  if (!individualTravelMap) {
    return res.status(404).json({ error: 'Not found' });
  }

  const { visitedCountries } = req.body;
  if (!isVisitedCountriesValid(visitedCountries)) {
    return res.status(400).json({ error: 'Invalid visitedCountries' });
  }
  const updatedIndividualTravelMap = await prisma.individualTravelMap.update({
    where: { id: individualTravelMap.id },
    data: { visitedCountries },
  });

  const response = formatApiIndividualTravelMapResponse(
    updatedIndividualTravelMap,
    individualTravelMap.user
  );
  res.status(200).json(response);
};

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    GET: handleGet,
    // the patch endpoint doesn't take an ID because users only have 1 map
    PATCH: handlePatch,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
});
