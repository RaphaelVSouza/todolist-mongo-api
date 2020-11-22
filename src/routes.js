import { Router } from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import authMiddleware from './app/middlewares/auth.js';
import errorMiddleware from './app/middlewares/error.js';

import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import PasswordController from './app/controllers/PasswordController.js';
import ProjectController from './app/controllers/ProjectController.js';
import TaskController from './app/controllers/TaskController.js';
import UserMailController from './app/controllers/UserMailController.js';

import validateUserStore from './app/validators/UserStore.js';
import validateUserUpdate from './app/validators/UserUpdate.js';
import validatePasswordStore from './app/validators/PasswordStore.js';
import validatePasswordUpdate from './app/validators/PasswordUpdate.js';
import validateSessionStore from './app/validators/SessionStore.js';

import redisConfig from './config/redis.js';

const store = new RedisStore(redisConfig);
const bruteforce = new ExpressBrute(store);
const routes = new Router();

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

routes.put('/projects/task', TaskController.update);

routes.use(errorMiddleware);

export default routes;