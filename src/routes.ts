import ExpressBrute from 'express-brute'
import mongo from './database/mongo'

import MongoStore from 'express-brute-mongo'

import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs from 'swagger-jsdoc'
import multer from 'multer'
import { Router } from 'express'

import UserController from './app/controllers/UserController'
import AvatarController from './app/controllers/AvatarController'
import SessionController from './app/controllers/SessionController'
import PasswordController from './app/controllers/PasswordController'
import ProjectController from './app/controllers/ProjectController'
import TaskController from './app/controllers/TaskController'
import UserMailController from './app/controllers/UserMailController'

import validateUserStore from './app/middlewares/validators/UserStore'
import validateUserUpdate from './app/middlewares/validators/UserUpdate'
import validatePasswordStore from './app/middlewares/validators/PasswordStore'
import validatePasswordUpdate from './app/middlewares/validators/PasswordUpdate'
import validateSessionStore from './app/middlewares/validators/SessionStore'
import validateProjectStore from './app/middlewares/validators/ProjectStore'
import validateProjectUpdate from './app/middlewares/validators/ProjectUpdate'
import validateProjectIndex from './app/middlewares/validators/ProjectIndex'

import multerConfig from './app/config/multer'
import swaggerOptions from './documentation/docSwagger'
import retries from './app/config/brute'
import errorMiddleware from './app/middlewares/error'

const db = mongo.connect()

const store = new MongoStore(function (ready) {
  ready(db.collection('bruteforce-store'))
})

const bruteforce = new ExpressBrute(store, { freeRetries: retries })

const specs = swaggerDocs(swaggerOptions)

const routes = Router()

routes.use('/docs', swaggerUi.serve)

routes.get('/', (req, res) => {
  res.send('API is running')
})

routes.get(
  '/docs',
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none !important }',
    customSiteTitle: 'TodoList | Documentation'
  })
)

routes.post(
  '/register',
  multer(multerConfig).single('file'),
  validateUserStore,
  UserController.store
)

routes.post(
  '/login',
  bruteforce.prevent,
  validateSessionStore,
  SessionController.store
)

routes.delete(
  '/user-management/delete-photo',
  passport.authenticate('jwt', { session: false }),
  AvatarController.delete
)

routes.get('/verify-email/:verifyToken', UserMailController.verifyEmail)
routes.post('/verify-email/re-send', UserMailController.sendVerificationMail)

routes.post('/forgot-password', validatePasswordStore, PasswordController.store)
routes.put(
  '/reset-password/:resetToken',
  validatePasswordUpdate,
  PasswordController.update
)

routes.put(
  '/user-management/edit-account',
  passport.authenticate('jwt', { session: false }),
  multer(multerConfig).single('file'),
  validateUserUpdate,
  UserController.update
)

routes.delete(
  '/user-management/delete-account',
  passport.authenticate('jwt', { session: false }),
  validateUserUpdate,
  UserController.delete
)

routes.post(
  '/my-projects/create-project',
  validateProjectStore,
  passport.authenticate('jwt', { session: false }),
  ProjectController.store
)

routes.get(
  '/my-projects/all-projects',
  passport.authenticate('jwt', { session: false }),
  validateProjectIndex,
  ProjectController.index
)

routes.get(
  '/my-projects/:projectId/tasks',
  passport.authenticate('jwt', { session: false }),
  ProjectController.show
)
routes.put(
  '/my-projects/:projectId/edit',
  validateProjectUpdate,
  passport.authenticate('jwt', { session: false }),
  ProjectController.update
)
routes.delete(
  '/my-projects/:projectId/delete',
  passport.authenticate('jwt', { session: false }),
  ProjectController.delete
)

routes.put(
  '/task/:taskId/edit',
  passport.authenticate('jwt', { session: false }),
  TaskController.update
)

routes.delete(
  '/task/:taskId/delete',
  passport.authenticate('jwt', { session: false }),
  TaskController.delete
)

routes.use(errorMiddleware)

export default routes
