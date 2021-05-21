const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');


/* const { safeLoad } = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const { readFileSync } = require('fs');
const { join } = require('path'); */


const routes = require('./routes');

const app = express();

// gerador de log de requisição 
const logger = require('morgan');
const fs = require('fs');
app.use(logger('common', {
  stream: fs.createWriteStream('./access.log', { flags: 'a' })
}));
app.use(logger('dev'));

//CRIAÇÃO DO SWAGGER
/* const openApiSpec = safeLoad(readFileSync(join(__dirname, 'backend.yaml')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec)); */

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'X-Total-Count'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errors());
app.use(helmet());

module.exports = app;