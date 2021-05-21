require('dotenv').config();
const express = require('express');
const jwt = require('express-jwt');
const { celebrate } = require('celebrate');

const config = require('./config');

// instanciando os controladores
const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');
const ProfileController = require('./controllers/ProfileController');
const IncidentController = require('./controllers/IncidentController');

// instanciando as validações
const loginValidation = require('./validations/Session/LoginValidation');
const logoutValidation = require('./validations/Session/LogoutValidation');
const createUserValidation = require('./validations/User/CreateUserValidation');
const deleteUserValidation = require('./validations/User/DeleteUserValidation');
const profileValidation = require('./validations/Profile/ProfileValidation');
const accountValidation = require('./validations/Account/AccountValidation');
const updateAccountValidation = require('./validations/Account/UpdateAccountValidation');
const incidentsValidation = require('./validations/Incident/IncidentsValidation');
const deleteIncidentValidation = require('./validations/Incident/DeleteIncidentValidation');

const routes = express.Router();

const jwtCookie = require('./utils/jwt.cookie');

// Rota de login
routes.post('/sessions', celebrate(loginValidation), SessionController.create);
routes.put('/sessions', jwt({secret:config.token.secret, getToken: jwtCookie}), SessionController.update);
routes.delete('/sessions', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(logoutValidation), SessionController.delete);

// Rotas de Users
routes.get('/users', UserController.index);
routes.post('/users', celebrate(createUserValidation), UserController.create);
routes.delete('/users', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(deleteUserValidation), UserController.delete);

// Rota de conta do User
routes.get('/account', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(accountValidation), UserController.show);
routes.put('/account', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(updateAccountValidation), UserController.update);

// Rota Profile
routes.get('/profile', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(profileValidation), ProfileController.index);

// Rotas de incidents
routes.get('/incidents', celebrate(incidentsValidation), IncidentController.index);
routes.post('/incidents', jwt({secret:config.token.secret, getToken: jwtCookie}), IncidentController.create);
routes.get('/incidents/:id', jwt({secret:config.token.secret, getToken: jwtCookie}), IncidentController.show);
routes.put('/incidents/:id', jwt({secret:config.token.secret, getToken: jwtCookie}), IncidentController.update);
routes.delete('/incidents/:id', jwt({secret:config.token.secret, getToken: jwtCookie}), celebrate(deleteIncidentValidation), IncidentController.delete);

module.exports = routes;
