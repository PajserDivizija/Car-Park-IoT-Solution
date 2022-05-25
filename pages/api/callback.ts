import { NextApiRequest, NextApiResponse } from 'next';

const clientId = '4mme7e1k72dc0icgbp6t9oi014';
const clientSecret = 'sj87icadr8rom6u2e5g5ifkegiekafohm89lt8t04pko12bu31u';

const Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  await fetch(
    `https://parking-frontend.auth.us-east-1.amazoncognito.com/oauth2/token?code=${code}&grant_type=authorization_code&client_id=${clientId}&redirect_uri=http://localhost:3000/api/callback/`,
    {
      method: 'POST',
      headers: {
        Authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      res.redirect(
        `/?access_token=${data.access_token}&id_token=${data.id_token}&refresh_token=${data.refresh_token}`
      );
    });
}
