import express from 'express';
import WebhookService from '../utils/webhookService';

const router = new express.Router();


/**
 * @swagger
 * /sync/hooks:
 *   post:
 *     summary: 新建 Webhook
 *     description: 返回创建好的 Webhook 的信息
 *     tags:
 *       - Webhook
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: 项目/组织 id
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         required: true
 *         description: webhook种类
 *         schema:
 *           type: string
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
 *       - name: data
 *         in: body
 *         required: true
 *         description: 请求体。callbackURL 是 hook 地址，events 是设定哪些事件触发时 POST URL。
 *         schema:
 *           type: object
 *           properties:
 *             callbackURL:
 *               type: string
 *               required: true
 *               default: http://xxxxxx.com
 *             active:
 *               type: boolean
 *               required: false
 *               default: true
 *             events:
 *               required: false
 *               schema:
 *                 type: array
 *                 default: ["task.done"]
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Webhook 新建成功
 */
router.post('/hooks', async (req, res, next) => {
  try {
    const service = new WebhookService(req.user);
    const { id, type } = req.query;
    const result = await service.createWebhook(id, type, req.body);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /sync/hooks:
 *   get:
 *     summary: 获取 Webhook
 *     description: 返回 Webhook 的信息
 *     tags:
 *       - Webhook
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: 项目/组织 id
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         required: true
 *         description: webhook种类
 *         schema:
 *           type: string
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
 *         description: Webhook 新建成功
 */
router.get('/hooks', async (req, res, next) => {
  try {
    const service = new WebhookService(req.user);
    const { id, type } = req.query;
    const result = await service.getWebhook(id, type);
    res.send({ result });
  } catch (err) {
    next(err);
  }
});
export default router;
