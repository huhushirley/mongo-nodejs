import { User } from 'models';
import Teambition from '../utils/teambition';
import config from 'config';

export async function auth(req, res, next) {
  try {
    const { appName, userId } = req.query;
    const user = await User.findOne({ appName, userId });
    if (user) {
      req.user = user;
      req.tb = new Teambition(user.token,
    { host: config.host, authHost: config.authHost, protocol: 'http' });

      return next();
    }
    return res.status(401).send({ msg: 'invalid user, please request a token' });
  } catch (err) {
    return next(err);
  }
}

export async function superAdmin(req, res, next) {
  try {
    const organizationId = req.query._organizationId || config.organizationId;
    const organization = await req.tb.get(`/api/organizations/${organizationId}`);
    if (organization._roleId === 1 || organization._roleId === 2) {
      return next();
    }
    return res.status(403).send({ msg: 'superAdmin Unauthorized' });
  } catch (err) {
    return next(err);
  }
}
