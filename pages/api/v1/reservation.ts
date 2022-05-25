import { NextApiRequest, NextApiResponse } from 'next';
import { state } from '../../../lib/state';
import { mqtt } from 'aws-iot-device-sdk-v2';

export default async function reservation(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.send({ data: { reserved: state.reserved } });
  } else if (req.method === 'POST') {
    state.reserved = !state.reserved;

    return res.send({ data: { reserved: state.reserved } });
  } else if (req.method === 'PATCH') {
    state.reserved = false;
    state.sensor = true;

    return res.send({ data: { reserved: state.reserved } });
  } else {
    return res.status(405).send({ error: { message: 'Method not allowed' } });
  }
}
