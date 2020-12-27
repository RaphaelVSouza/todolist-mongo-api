import { Router } from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';
import passport from 'passport';

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
import validateProjectStore from './app/validators/ProjectStore.js';
import validateProjectUpdate from './app/validators/ProjectUpdate.js';
import validateProjectIndex from './app/validators/ProjectIndex.js';

import redisConfig from './config/redis.js';

let retries = 2;
const store = new RedisStore(redisConfig);
if(process.env.NODE_ENV !== 'production')
  retries = 9999;

const bruteforce = new ExpressBrute(store, {freeRetries: retries});

const routes = new Router();

routes.post('/user-management/register',validateUserStore, UserController.store);

routes.post('/user-management/login', bruteforce.prevent, validateSessionStore,  SessionController.store);

routes.get('/user-management/verify_email/:verifyToken', UserMailController.verifyEmail);

routes.post('/user-management/forgot_password', validatePasswordStore, PasswordController.store);
routes.post('/user-management/reset_password/:resetToken', validatePasswordUpdate, PasswordController.update);

// Protected routes

routes.put('/user-management/refresh', SessionController.update);

routes.put('/user-management/edit', passport.authenticate('jwt', { session: false}), validateUserUpdate, UserController.update);

routes.post('/projects/new',validateProjectStore, passport.authenticate('jwt', { session: false}), ProjectController.store);
routes.get('/projects',passport.authenticate('jwt', { session: false}), validateProjectIndex, ProjectController.index);
routes.get('/projects/:projectId', passport.authenticate('jwt', { session: false}), ProjectController.show);
routes.put('/projects/:projectId/edit', validateProjectUpdate, passport.authenticate('jwt', { session: false}), ProjectController.update);
routes.delete('/projects/:projectId/delete', passport.authenticate('jwt', { session: false}), ProjectController.delete);

routes.put('/projects/task',passport.authenticate('jwt', { session: false}), TaskController.update);

routes.use(errorMiddleware);

export default routes;
