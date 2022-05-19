import { NextApiRequest, NextApiResponse } from 'next';

const sensor = true;

export default async function sensorHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.send({ data: { sensor } });
  } else {
    return res.status(405).send({ error: { message: 'Method not allowed' } });
  }
}
