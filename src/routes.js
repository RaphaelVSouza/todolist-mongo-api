const { Router } = require('express');
const ExpressBrute = require('express-brute');

const routes = new Router();
const authMiddleware = require('./app/middlewares/auth');

if(process.env.NODE_ENV === 'production') {
    console.warn("Don't use local storage in express-brute on production!")
} 
    
const store = new ExpressBrute.MemoryStore(); 
const bruteforce = new ExpressBrute(store);

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const PasswordController = require('./app/controllers/PasswordController');
const ProjectController = require('./app/controllers/ProjectController');


routes.get('/', (req, res) => {
    res.json({message: 'rodou'});
})

routes.post('/user-management/register', UserController.store);


routes.post('/user-management/login', bruteforce.prevent, SessionController.store);


routes.post('/user-management/forgot_password', PasswordController.store)
routes.post('/user-management/reset_password', PasswordController.update)

routes.use(authMiddleware);

routes.post('/projects/new', ProjectController.store)
routes.get('/projects', ProjectController.index)
routes.get('/projects/:projectId', ProjectController.show)
routes.put('/projects/:projectId/edit', ProjectController.update)
routes.delete('/projects/:projectId/delete', ProjectController.delete)

module.exports = routes;