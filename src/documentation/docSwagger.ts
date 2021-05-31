import schemas from './docSchemas'

import signRoutes from './routes/signRoutes'
import userRoutes from './routes/userRoutes'
import passwordRoutes from './routes/passwordRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'
const isProd = process.env.NODE_ENV === 'production'

const config = {
  swaggerDefinition: {
    components: {
      schemas,
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        Bearer: []
      }
    ],
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: 'An API to register users, projects and tasks',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      },
      contact: {
        name: 'Raphael',
        email: 'raphael5254@outlook.com'
      }
    },
    servers: [
      {
        url: isProd
          ? `${process.env.SERVER_HOST}:${process.env.PORT}`
          : `${process.env.SERVER_HOST}`,
        description: 'Server'
      }
    ],
    tags: [
      {
        name: 'Register/Session'
      },
      {
        name: 'Password'
      },
      {
        name: 'User Management - Edit/Delete'
      },
      {
        name: 'User Management - Avatar'
      },
      {
        name: 'Projects'
      }
    ],
    paths: {
      '/register': signRoutes.register,
      '/login': signRoutes.login,
      '/user-management/delete-photo': userRoutes.avatar_delete,
      '/verify-email/{verifyToken}': signRoutes.verify_email,
      '/verify-email/re-send': signRoutes.send_verify_email,
      '/forgot-password': passwordRoutes.forgot_password,
      '/reset-password/{resetToken}': passwordRoutes.reset_password,
      '/user-management/edit-account': userRoutes.user_update,
      '/user-management/delete-account': userRoutes.user_delete,
      '/my-projects/create-project': projectRoutes.project_create,
      '/my-projects/all-projects': projectRoutes.project_index,
      '/my-projects/{projectId}/edit': projectRoutes.project_update,
      '/my-projects/{projectId}/tasks': projectRoutes.project_show,
      '/my-projects/{projectId}/delete': projectRoutes.project_delete,
      '/task/{taskId}/edit': taskRoutes.task_update,
      '/task/{taskId}/delete': taskRoutes.task_delete
    }
  },

  apis: []
}

export default config

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
