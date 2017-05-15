// 封装调用tb webhook api的服务
import Teambition from './teambition';
import config from '../config';

export default class WebhookService {
  constructor(user) {
    this._tb = new Teambition(user.token,
      { host: config.host, authHost: config.authHost, protocol: 'http' });
  }

  createWebhook(id, type, body) {
    return this._tb.post(`/api/${type}/${id}/hooks`, body);
  }

  getWebhook(id, type, hookId) {
    if (hookId) return this._tb.get(`/api/${type}/${id}/hooks/${hookId}`);
    return this._tb.get(`/api/${type}/${id}/hooks`);
  }
}

