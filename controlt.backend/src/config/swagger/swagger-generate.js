import swaggerAutogen from 'swagger-autogen';
import { dtoSchemas } from './swagger-dtos.js';

const doc = {
    info: {
        version: '1.0.0',
        title: 'ControlT API',
        description: 'API do sistema ControlT'
    },
    host: 'localhost:3000',
    basePath: '/api',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Bearer token para autenticação'
        }
    },
    definitions: dtoSchemas
};

const outputFile = './src/config/swagger/swagger-output.json';
const routes = ['./src/routes/index.route.js'];

swaggerAutogen()(outputFile, routes, doc).then();