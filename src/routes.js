const { Router } = require('express');
const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');

const redisConfig = require('./config/redisConfig');
const routes = new Router();
const authMiddleware = require('./app/middlewares/auth');

const store = new RedisStore(redisConfig);
    
const bruteforce = new ExpressBrute(store);

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const PasswordController = require('./app/controllers/PasswordController');
const ProjectController = require('./app/controllers/ProjectController');
const UserMailController = require('./app/controllers/UserMailController');

const validateUserStore = require('./app/validators/UserStore');
const validateUserUpdate = require('./app/validators/UserUpdate');
const validatePasswordStore = require('./app/validators/PasswordStore');
const validatePasswordUpdate = require('./app/validators/PasswordUpdate');
const validateSessionStore = require('./app/validators/SessionStore');
const SessionStore = require('./app/validators/SessionStore');

routes.post('/user-management/register', validateUserStore, UserController.store);


routes.post('/user-management/login', bruteforce.prevent, SessionStore,  SessionController.store);

routes.get('/user-management/verify_email/:verifyToken', UserMailController.verifyEmail);

routes.post('/user-management/forgot_password', validatePasswordStore, PasswordController.store);
routes.post('/user-management/reset_password/:resetToken', validatePasswordUpdate, PasswordController.update);

routes.use(authMiddleware);

routes.put('/user-management/edit', validateUserUpdate, UserController.update);

routes.post('/projects/new', ProjectController.store);
routes.get('/projects', ProjectController.index);
routes.get('/projects/:projectId', ProjectController.show);
routes.put('/projects/:projectId/edit', ProjectController.update);
routes.delete('/projects/:projectId/delete', ProjectController.delete);

module.exports = routes;