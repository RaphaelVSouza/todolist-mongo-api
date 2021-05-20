"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_brute_1 = __importDefault(require("express-brute"));
const mongo_1 = __importDefault(require("./database/mongo"));
const express_brute_mongo_1 = __importDefault(require("express-brute-mongo"));
const passport_1 = __importDefault(require("passport"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const AvatarController_1 = __importDefault(require("./app/controllers/AvatarController"));
const SessionController_1 = __importDefault(require("./app/controllers/SessionController"));
const PasswordController_1 = __importDefault(require("./app/controllers/PasswordController"));
const ProjectController_1 = __importDefault(require("./app/controllers/ProjectController"));
const TaskController_1 = __importDefault(require("./app/controllers/TaskController"));
const UserMailController_1 = __importDefault(require("./app/controllers/UserMailController"));
const UserStore_1 = __importDefault(require("./app/middlewares/validators/UserStore"));
const UserUpdate_1 = __importDefault(require("./app/middlewares/validators/UserUpdate"));
const PasswordStore_1 = __importDefault(require("./app/middlewares/validators/PasswordStore"));
const PasswordUpdate_1 = __importDefault(require("./app/middlewares/validators/PasswordUpdate"));
const SessionStore_1 = __importDefault(require("./app/middlewares/validators/SessionStore"));
const ProjectStore_1 = __importDefault(require("./app/middlewares/validators/ProjectStore"));
const ProjectUpdate_1 = __importDefault(require("./app/middlewares/validators/ProjectUpdate"));
const ProjectIndex_1 = __importDefault(require("./app/middlewares/validators/ProjectIndex"));
const multer_2 = __importDefault(require("./app/config/multer"));
const docSwagger_1 = __importDefault(require("./documentation/docSwagger"));
const brute_1 = __importDefault(require("./app/config/brute"));
const error_1 = __importDefault(require("./app/middlewares/error"));
const db = mongo_1.default.connect();
const store = new express_brute_mongo_1.default(function (ready) {
    ready(db.collection('bruteforce-store'));
});
const bruteforce = new express_brute_1.default(store, { freeRetries: brute_1.default });
const specs = swagger_jsdoc_1.default(docSwagger_1.default);
const routes = express_1.Router();
routes.use('/docs', swagger_ui_express_1.default.serve);
routes.get('/', (req, res) => {
    res.send('API is running');
});
routes.get('/docs', swagger_ui_express_1.default.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none !important }',
    customSiteTitle: 'TodoList | Documentation'
}));
routes.post('/register', multer_1.default(multer_2.default).single('file'), UserStore_1.default, UserController_1.default.store);
routes.post('/login', bruteforce.prevent, SessionStore_1.default, SessionController_1.default.store);
routes.delete('/user-management/delete-photo', passport_1.default.authenticate('jwt', { session: false }), AvatarController_1.default.delete);
routes.get('/verify-email/:verifyToken', UserMailController_1.default.verifyEmail);
routes.post('/verify-email/re-send', UserMailController_1.default.sendVerificationMail);
routes.post('/forgot-password', PasswordStore_1.default, PasswordController_1.default.store);
routes.put('/reset-password/:resetToken', PasswordUpdate_1.default, PasswordController_1.default.update);
routes.put('/user-management/edit-account', passport_1.default.authenticate('jwt', { session: false }), multer_1.default(multer_2.default).single('file'), UserUpdate_1.default, UserController_1.default.update);
routes.delete('/user-management/delete-account', passport_1.default.authenticate('jwt', { session: false }), UserUpdate_1.default, UserController_1.default.delete);
routes.post('/my-projects/create-project', ProjectStore_1.default, passport_1.default.authenticate('jwt', { session: false }), ProjectController_1.default.store);
routes.get('/my-projects/all-projects', passport_1.default.authenticate('jwt', { session: false }), ProjectIndex_1.default, ProjectController_1.default.index);
routes.get('/my-projects/:projectId/tasks', passport_1.default.authenticate('jwt', { session: false }), ProjectController_1.default.show);
routes.put('/my-projects/:projectId/edit', ProjectUpdate_1.default, passport_1.default.authenticate('jwt', { session: false }), ProjectController_1.default.update);
routes.delete('/my-projects/:projectId/delete', passport_1.default.authenticate('jwt', { session: false }), ProjectController_1.default.delete);
routes.put('/task/:taskId/edit', passport_1.default.authenticate('jwt', { session: false }), TaskController_1.default.update);
routes.delete('/task/:taskId/delete', passport_1.default.authenticate('jwt', { session: false }), TaskController_1.default.delete);
routes.use(error_1.default);
exports.default = routes;
