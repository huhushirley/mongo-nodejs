/* eslint-disable */
'use strict';
const request = require('request');
const querystring = require('querystring');

class Teambition {
  constructor(token, config = {}) {
    this.token = token;
    this.protocol = config.protocol || 'https';
    this.host = config.host || 'api.teambition.com';
    this.authHost = config.authHost || 'account.teambition.com';
  }

  /**
   * auth url
   * @param clientId
   * @param redirectUri
   * @param state
   * @returns {string}
   */
  getAuthorizeUrl(clientId, redirectUri, state) {
    const qs = querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      state
    });
    return `${this.protocol}://${this.authHost}/oauth2/authorize?${qs}`;
  }

  /**
   * access token url
   * @returns {string}
   */
  getAccessTokenUrl() {
    return `${this.protocol}://${this.authHost}/oauth2/access_token`;
  }

  /**
   * auth middleware
   * @param clientId
   * @param clientSecret
   * @returns {function(*, *, *)}
   */
  authCallback(clientId, clientSecret) {
    const self = this;
    return (req, res, next) => {
      const code = req.query.code;
      const api = self.getAccessTokenUrl();
      return self.post(api, {
        client_id: clientId,
        client_secret: clientSecret,
        code
      }, (err, body) => {
        if (err) throw err;
        req.callbackBody = body;
        return next();
      });
    };
  }

  /**
   * generic request
   * @param method
   * @param apiURL
   * @param params
   * @param callback
   * @returns {Promise}
   */
  invokeGeneric(method, apiURL, params, callback) {
    let headers = {};
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    params || (params = {});
    if (apiURL.indexOf('/') === 0) {
      apiURL = `${this.protocol}://${this.host}${apiURL}`;
    }
    headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = 'OAuth2 ' + this.token;
    }
    if (params.headers) {
      headers = params.headers;
      delete params.headers;
    }
    const options = {
      method,
      headers,
      url: apiURL,
      json: true
    };
    if (method.toLowerCase() !== 'get') {
      options.form = params;
    } else {
      options.qs = params;
    }
    return new Promise((resolve, reject) => {
      request(options, (err, resp, body) => {
        if (err || resp && resp.statusCode !== 200) {
          err || (err = body);
        }
        if (typeof callback === 'function') {
          resolve(callback(err, body));
        } else {
          if (err) reject(err);
          resolve(body);
        }
      }
      );
    });
  }

  api(apiURL, params, callback) {
    return this.invokeGeneric('GET', apiURL, params, callback);
  }

  get() {
    return this.api.apply(this, arguments);
  }

  post(apiURL, params, callback) {
    return this.invokeGeneric('POST', apiURL, params, callback);
  }

  put(apiURL, params, callback) {
    return this.invokeGeneric('PUT', apiURL, params, callback);
  }

  del(apiURL, params, callback) {
    return this.invokeGeneric('DELETE', apiURL, params, callback);
  }
}

module.exports = Teambition;
