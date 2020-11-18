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

routes.post('/user-management/register', UserController.store);


routes.post('/user-management/login', bruteforce.prevent,  SessionController.store);

routes.get('/user-management/verify_email/:verifyToken', UserMailController.verifyEmail);

routes.post('/user-management/forgot_password', PasswordController.store);
routes.post('/user-management/reset_password/:resetToken', PasswordController.update);

routes.use(authMiddleware);

routes.put('/user-management/edit', SessionController.update);

routes.post('/projects/new', ProjectController.store);
routes.get('/projects', ProjectController.index);
routes.get('/projects/:projectId', ProjectController.show);
routes.put('/projects/:projectId/edit', ProjectController.update);
routes.delete('/projects/:projectId/delete', ProjectController.delete);

module.exports = routes;