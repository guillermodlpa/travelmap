import type { NextApiRequest, NextApiResponse } from 'next';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getMapListHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404);
  }

  await sleep(4000);

  res.status(200).json([
    { slug: 'carla', userDisplayName: `Carla` },
    { slug: 'jon', userDisplayName: `Jon` },
    { slug: 'taylor123', userDisplayName: `Taylor` },
    { slug: 'pip12', userDisplayName: `Pip` },
    { slug: 'fito', userDisplayName: `Fito` },
    { slug: 'robertasuper', userDisplayName: `Roberta` },
    { slug: 'halflifegman', userDisplayName: `Gman` },
  ]);
};

export default getMapListHandler;
