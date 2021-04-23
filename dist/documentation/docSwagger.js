"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const docSchemas_1 = __importDefault(require("./docSchemas"));
const signRoutes_1 = __importDefault(require("./routes/signRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const passwordRoutes_1 = __importDefault(require("./routes/passwordRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const config = {
    swaggerDefinition: {
        components: {
            schemas: docSchemas_1.default,
            securitySchemes: {
                Bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                Bearer: [],
            },
        ],
        openapi: '3.0.0',
        info: {
            title: 'Todo List API',
            version: '1.0.0',
            description: 'An API to register users, projects and tasks',
            license: {
                name: 'MIT',
                url: 'https://choosealicense.com/licenses/mit/',
            },
            contact: {
                name: 'Raphael',
                email: 'raphael5254@outlook.com',
            },
        },
        servers: [
            {
                url: `${process.env.FRONT_URL}`,
                description: 'Server',
            },
        ],
        tags: [
            {
                name: 'Register/Session',
            },
            {
                name: 'Password',
            },
            {
                name: 'User Management - Edit/Delete',
            },
            {
                name: 'User Management - Avatar',
            },
            {
                name: 'Projects',
            },
        ],
        paths: {
            '/register': signRoutes_1.default.register,
            '/login': signRoutes_1.default.login,
            '/user-management/delete-photo': userRoutes_1.default.avatar_delete,
            '/verify-email/{verifyToken}': signRoutes_1.default.verify_email,
            '/forgot-password': passwordRoutes_1.default.forgot_password,
            '/reset-password/{resetToken}': passwordRoutes_1.default.reset_password,
            '/user-management/edit-account': userRoutes_1.default.user_update,
            '/user-management/delete-account': userRoutes_1.default.user_delete,
            '/my-projects/create-project': projectRoutes_1.default.project_create,
            '/my-projects/all-projects': projectRoutes_1.default.project_index,
            '/my-projects/{projectId}/edit': projectRoutes_1.default.project_update,
            '/my-projects/{projectId}/tasks': projectRoutes_1.default.project_show,
            '/my-projects/{projectId}/delete': projectRoutes_1.default.project_delete,
            '/task/{taskId}/edit': taskRoutes_1.default.task_update,
            '/task/{taskId}/delete': taskRoutes_1.default.task_delete,
        },
    },
    apis: [],
};
exports.default = config;
