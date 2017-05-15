/* eslint-disable no-unused-vars*/
export default function (err, req, res, next) {
  const error = {};
  error.msg = err.msg || err.message || err || 'Unknown reason';
  const status = err.status || '400';
  return res.status(status).send(error);
}
