import express from 'express';
import { swagDocHandler } from '../utils';
import oauth from './oauth';
import { auth } from './privilege';
import webhook from './webhook';

const router = new express.Router();

router.get('/', async (req, res) => {
  res.send({ msg: 'HELLO WORLD' });
});

// return swagger doc json data.
// open [http://swagger.daguchuangyi.com/?url=http://localhost:8888/swagger.json#!]
// to use Swagger UI to visualize the doc
router.get('/swagger.json', swagDocHandler);

router.use('/oauth', oauth);
router.use(auth);


export default router;
