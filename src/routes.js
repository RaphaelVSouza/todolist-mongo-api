import express from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from 'swagger-jsdoc';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import AvatarController from './app/controllers/AvatarController';
import SessionController from './app/controllers/SessionController';
import PasswordController from './app/controllers/PasswordController';
import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';
import UserMailController from './app/controllers/UserMailController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validatePasswordStore from './app/validators/PasswordStore';
import validatePasswordUpdate from './app/validators/PasswordUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateProjectStore from './app/validators/ProjectStore';
import validateProjectUpdate from './app/validators/ProjectUpdate';
import validateProjectIndex from './app/validators/ProjectIndex';

import redisConfig from './config/redis';
import multerConfig from './config/multer';
import swaggerOptions from '../documentation/docSwagger';
import { retries } from './config/brute';
import errorMiddleware from './app/middlewares/error';

const store = new RedisStore(redisConfig);

const jwtConfig = ['jwt', { session: false }];

const bruteforce = new ExpressBrute(store, { freeRetries: retries });

const app = express();

const specs = swaggerDocs(swaggerOptions);

app.use('/docs', swaggerUi.serve);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get(
  '/docs',
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none !important }',
    customSiteTitle: 'TodoList | Documentation',
  }),
);

app.post('/register', multer(multerConfig).single('file'), validateUserStore, UserController.store);

app.post('/login', bruteforce.prevent, validateSessionStore, SessionController.store);

app.delete('/:avatarId/deletePhoto', passport.authenticate(...jwtConfig), AvatarController.delete);

app.get('/verify-email/:verifyToken', UserMailController.verifyEmail);
app.post('/verify-email/re-send', UserMailController.resendVerifyMail);

app.post('/forgot-password', validatePasswordStore, PasswordController.store);
app.put('/reset-password/:resetToken', validatePasswordUpdate, PasswordController.update);

app.put(
  '/user-management/edit-account',
  passport.authenticate(...jwtConfig),
  multer(multerConfig).single('file'),
  validateUserUpdate,
  UserController.update,
);

app.delete(
  '/user-management/delete-account',
  passport.authenticate(...jwtConfig),
  validateUserUpdate,
  UserController.delete,
);

app.post(
  '/my-projects/create-project',
  validateProjectStore,
  passport.authenticate(...jwtConfig),
  ProjectController.store,
);

app.get(
  '/my-projects/all-projects',
  passport.authenticate(...jwtConfig),
  validateProjectIndex,
  ProjectController.index,
);

app.get(
  '/my-projects/:projectId/tasks',
  passport.authenticate(...jwtConfig),
  ProjectController.show,
);
app.put(
  '/my-projects/:projectId/edit',
  validateProjectUpdate,
  passport.authenticate(...jwtConfig),
  ProjectController.update,
);
app.delete(
  '/my-projects/:projectId/delete',
  passport.authenticate(...jwtConfig),
  ProjectController.delete,
);

app.put('/task/:taskId/edit', passport.authenticate(...jwtConfig), TaskController.update);

app.delete('/task/:taskId/delete', passport.authenticate(...jwtConfig), TaskController.delete);

app.use(errorMiddleware);

export default app;
