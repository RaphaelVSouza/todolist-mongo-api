const { Router } = require('express');
const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');


const routes = new Router();
const authMiddleware = require('./app/middlewares/auth');
const errorMiddleware = require('./app/middlewares/error');

const redisConfig = require('./config/redisConfig');

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

routes.post('/user-management/register', validateUserStore, UserController.store);


routes.post('/user-management/login', bruteforce.prevent, validateSessionStore,  SessionController.store);

routes.get('/user-management/verify_email/:verifyToken', UserMailController.verifyEmail);

routes.post('/user-management/forgot_password', validatePasswordStore, PasswordController.store);
routes.post('/user-management/reset_password/:resetToken', validatePasswordUpdate, PasswordController.update);


// Protected routes

routes.put('/user-management/edit', authMiddleware, validateUserUpdate, UserController.update);

routes.post('/projects/new', authMiddleware, ProjectController.store);
routes.get('/projects',authMiddleware, ProjectController.index);
routes.get('/projects/:projectId', authMiddleware, ProjectController.show);
routes.put('/projects/:projectId/edit', authMiddleware, ProjectController.update);
routes.delete('/projects/:projectId/delete', authMiddleware, ProjectController.delete);

routes.use(errorMiddleware);

module.exports = routes;