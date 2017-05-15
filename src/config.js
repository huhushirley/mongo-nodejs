const env = process.env.NODE_ENV;

// 通用配置
const common = {
  // 企业ID，不需要可删除
  organizationId: '58d8b24b6aeb155923b09805',
  /**
   * 应用配置格式如下：
   * appName: {
   *   key:app key
   *   secret:app secret
   *   redirect: 回调地址，需要在tb应用配置里面先填好回调地址
   * }
   */
  appName: {
    key: '',
    secret: '',
    redirect: 'http://localhost:8080/auth/callback',
  },

  // 部署的host的IP
  host: '101.37.28.30',
  authHost: '101.37.28.30',

  // 服务器主机
  baseUrl: 'http://localhost:8880',
};
const config = {
  // 开发环境配置
  develop: {
    baseUrl: 'http://localhost:8880',
    port: 8860,
    mongodb: {
      host: '127.0.0.1',
      database: 'beikong',
    }
  },

  // 生产环境配置
  production: {
    baseUrl: 'http://139.196.210.102:3010',
    port: 3010,
    mongodb: {
      host: '127.0.0.1',
      database: 'beikong',
      user: 'root',
      password: 'yGvSSKPtOGai63'
    },
  },
    // 生产环境配置
  deploy: {
    port: 3020,
    baseUrl: 'http://101.37.28.30:3020',
    mongodb: {
      host: '127.0.0.1',
      database: 'beikong',
    },
  },
  test: {
    baseUrl: 'http://139.196.210.102:3011',
    port: 3011,
    mongodb: {
      host: '127.0.0.1',
      database: 'beikong-test',
      user: 'root',
      password: 'yGvSSKPtOGai63'
    },
  }
};
export default Object.assign(common, config[env]);
