import config from 'config';
import rp from 'request-promise';

/**
 * 根据code和appName获取token
 * @param {String} code
 * @param {String} 应用名称
 */
export async function getAccessToken(code, appName = 'daily') {
  try {
    const options = {
      method: 'POST',
      uri: `http://${config.authHost}/oauth2/access_token`,
      body: {
        client_id: config[appName].key,
        client_secret: config[appName].secret,
        code,
        grant_type: 'code'
      },
      json: true,
    };

    const result = await rp(options);
    return result;
  } catch (err) {
    throw err;
  }
}

export function getAuthUrl(appName, userId, projectId = '', organizationId = '') {
  const { host, [appName]: { key, redirect } } = config;
  return `http://${host}/oauth2/authorize?client_id=${key}&response_type=code&redirect_uri=${redirect}&state=${appName},${userId},${projectId},${organizationId}`;
}
