import express from 'express';

import { getAccessToken, getAuthUrl } from '../utils/oauth';
import { User } from 'models';
import Teambition from '../utils/teambition';
import config from '../config';

const router = new express.Router();

/**
 * @swagger
 * /oauth/token:
 *   get:
 *     summary: 根据code,appName,userId获取access_token
 *     description: 根据code,appName,userId获取access_token
 *     tags:
 *       - Oauth
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: code
 *         type: string
 *       - name: appName
 *         in: query
 *         required: true
 *         description: 应用名称
 *         type: string
 *       - name: userId
 *         in: query
 *         required: true
 *         description: 用户id
 *         type: string
 *     responses:
 *       200:
 *         description: user
 */
router.get('/token', async(req, res, next) => {
  try {
    const { code, appName, userId } = req.query;
    if (!code || !appName || !userId) throw new Error('参数错误');
    const { access_token } = await getAccessToken(code, appName, userId);
    let user = await User.findOne({ userId, appName });
    if (user) {
      user.token = access_token;
    } else {
      user = new User({
        userId,
        appName,
        token: access_token,
      });
    }
    user = await user.save();
    return res.send({ token: user.token });
  } catch (err) {
    next(err);
  }
});


/**
 * @swagger
 * /oauth/check:
 *   get:
 *     summary: 检查是否有对应access_token
 *     description: 检查是否有对应access_token，若无，返回重定向地址
 *     tags:
 *       - Oauth
 *     parameters:
 *       - name: appName
 *         in: query
 *         required: true
 *         description: 应用名称
 *         type: string
 *       - name: userId
 *         in: query
 *         required: true
 *         description: 用户id
 *         type: string
 *       - name: projectId
 *         in: query
 *         required: false
 *         description: 项目id
 *         type: string
 *       - name: organizationId
 *         in: query
 *         required: false
 *         description: 企业id
 *         type: string
 *     responses:
 *       200:
 *         description: user
 */
router.get('/check', async(req, res) => {
  const { appName, userId, projectId = '', organizationId = '' } = req.query;
  try {
    const user = await User.findOne({ userId, appName });
    if (!user) {
      return res.send({ hasToken: false, authUrl: getAuthUrl(appName, userId, projectId, organizationId), msg: 'please request a token' });
    }
    const tb = new Teambition(user.token,
    { host: config.host, authHost: config.authHost, protocol: 'http' });
    await tb.get(`/api/applications/${config[appName].key}/tokens/check`);
    return res.send({ hasToken: true });
  } catch (err) {
    return res.send({ hasToken: false, authUrl: getAuthUrl(appName, userId, projectId, organizationId), msg: 'please request a token' });
  }
});
export default router;
