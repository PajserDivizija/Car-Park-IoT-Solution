import { NextApiRequest, NextApiResponse } from 'next';

let reserved = true;

export default async function reservation(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.send({ data: { reserved } });
  } else if (req.method === 'POST') {
    const newState = JSON.parse(req.body);

    ({ reserved } = newState);

    return res.send({ data: { reserved } });
  } else {
    return res.status(405).send({ error: { message: 'Method not allowed' } });
  }
}
