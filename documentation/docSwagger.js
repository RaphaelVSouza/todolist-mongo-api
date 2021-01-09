import schemas from './docSchemas';
import routes from './docRoutes';

const config = {
  swaggerDefinition: {
    components: {
      schemas,
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
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
    tags: [
      {
        name: 'User Management - Register/Session',
      },
      {
        name: 'User Management - Password',
      },
      {
        name: 'User Management - Edit/Delete',
      },
      {
        name: 'Projects',
      },
    ],
    paths: {
      '/user-management/register': routes.register,
      '/user-management/login': routes.login,
      '/user-management/verify_email/{verifyToken}': routes.verify_email,
      '/user-management/forgot_password': routes.forgot_password,
      '/user-management/reset_password/{resetToken}': routes.reset_password,
      '/user-management/edit-account': routes.user_update,
      '/user-management/delete-account': routes.user_delete,
      '/my-projects/create-project': routes.project_create,
      '/my-projects/all-projects': routes.project_index,
      '/my-projects/{projectId}/edit': routes.project_update,
      '/my-projects/{projectId}/tasks': routes.project_show,
      '/my-projects/{projectId}/delete': routes.project_delete,
      '/projects/{projectId}/tasks/{taskId}/edit': routes.task_update,
      '/projects/{projectId}/tasks/{taskId}/delete': routes.task_delete,
    },
  },

  apis: [],
};

export default config;

// * User Management - Register/Session

// * Register
// * Verify Email
// * Login

// * User Management - Password

// * Forgot Password
// * Reset password

// * User Management - Edit

// * Update User

// * Projects

// * Create
// * Read
// * Update
// * Delete

// Tasks - CRUD

// * Read
// * Update
// * Delete
