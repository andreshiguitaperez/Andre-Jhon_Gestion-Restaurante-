import { createAuth0User, getAuth0Token } from '../../utils/api';

const Auth0 = async (req: any, res: any) => {
  if (req.method === 'POST') {
    // const session = await getServerSession(req, res, options);
    // if (session) {
    const { data } = req.body;
    let userData;
    try {
      console.log('data :>> ', data);
      const { access_token: accessToken, token_type: tokenType } =
        await getAuth0Token()
          .then((resToken) => resToken)
          .catch((error) => error);
      data.connection = 'Username-Password-Authentication';
      userData = await createAuth0User(data, accessToken, tokenType).then(
        (resUser) => resUser
      );
    } catch (error) {
      req.status(409).send(`Error getting Auth0 token ${error}`);
    }
    if (!Object.keys(userData).includes('statusCode')) {
      return res.status(200).json({ usuario: userData });
    } else {
      return res.status(userData.statusCode).json({ error: userData.message });
    }
    // } else {
    //   res.status(401).send('Unauthorized');
    // }
  } else {
    res.status(405).send('Method not allowed');
  }
};

export default Auth0;
