import type { NextApiRequest, NextApiResponse } from 'next';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const mapHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sleep(4000);

  if (req.method === 'GET') {
    res
      .status(200)
      .json({
        slug: 'guillermodlpa',
        userDisplayName: `Guillermo`,
        countries: ['ESP', 'BLZ', 'MAR', 'MYS'],
      });
  }

  return res.status(404);
};

export default mapHandler;
