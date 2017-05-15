import path from 'path';
import swagger from 'swagger-jsdoc';

export default async function (req, res) {
  // swagger definition comes here
  const swaggerDefinition = {
    info: {
      title: 'TEMPLATE REST API DOC',
      version: '1.0.0',
      description: 'TEMPLATE REST API DOC',
    }
  };
  const options = {
    swaggerDefinition,
    apis: [path.resolve('src/routes/**/*.js'), path.resolve('src/models/**/*.js')],
  };

  const swaggerSpec = swagger(options);
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
}
