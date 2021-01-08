const routes = {
  register: {
    post: {
      tags: ['User Management - Register/Session'],
      produces: ['application/json'],
      description: 'register',
      operationId: 'createUser',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'User Successfully created',
        },
        400: {
          description: 'Bad Request',
        },
        403: {
          description: 'User already exists',
        },
      },
      security: [],
    },
  },
  verify_email: {
    get: {
      tags: ['User Management - Register/Session'],
      description: 'Verify Email to login',
      operationId: 'verifyEmail',
      parameters: [
        {
          name: 'verifyToken',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Email verified successfully',
        },
      },
      security: [],
    },
  },
  login: {
    post: {
      tags: ['User Management - Register/Session'],
      produces: ['application/json'],
      description: 'login',
      operationId: 'createSession',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Login',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'Token successfully generated',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Need to verify email first',
        },
        401: {
          description: 'User or password invalid',
        },
      },
      security: [],
    },
  },
  forgot_password: {
    post: {
      tags: ['User Management - Password'],
      produces: ['application/json'],
      description: 'Forgot password',
      operationId: 'forgotPassword',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/forgot_password',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'Recuperation mail sent',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'User not found',
        },
      },
      security: [],
    },
  },
  reset_password: {
    post: {
      tags: ['User Management - Password'],
      produces: ['application/json'],
      description: 'Reset password',
      operationId: 'resetPassword',
      parameters: [
        {
          name: 'resetToken',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/reset_password',
            },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: 'Password Successfully reseted',
        },
        400: {
          description: 'Bad Request',
        },
      },
      security: [],
    },
  },

  user_update: {
    put: {
      tags: ['User Management - Edit/Delete'],
      produces: ['application/json'],
      description: 'Edit user',
      operationId: 'updateUser',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User Successfully created',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'User already exists',
        },
      },
    },
  },
  user_delete: {
    delete: {
      tags: ['User Management - Edit/Delete'],
      produces: ['application/json'],
      description: 'Delete user',
      operationId: 'deleteUser',
      responses: {
        200: {
          description: 'User Successfully deleted',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
  project_create: {
    post: {
      tags: ['Projects'],
      produces: ['application/json'],
      description: 'Create Project and Tasks',
      operationId: 'createProject',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Project',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Project Successfully created',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
  project_index: {
    get: {
      tags: ['Projects'],
      description: 'Find all the logged user projects, have pagination',
      operationId: 'readProjects',
      parameters: [
        {
          name: 'skip',
          description: '',
          in: 'query',
          type: 'integer',
        },
        {
          name: 'limit',
          description: '',
          in: 'query',
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'Array with projects',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
  project_update: {
    put: {
      tags: ['Projects'],
      produces: ['application/json'],
      description: 'Update Project and Tasks',
      operationId: 'updateProject',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Project',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Project Successfully updated',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
  project_show: {
    get: {
      tags: ['Projects'],
      produces: ['application/json'],
      description: "Show a single user's logged project and tasks",
      operationId: 'showProject',
      parameters: [
        {
          name: 'projectId',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'A project with tasks',
        },
        400: {
          description: 'Bad Request',
        },
      },
    },
  },
  project_delete: {
    delete: {
      tags: ['Projects'],
      produces: ['application/json'],
      description: "Delete a single user's logged project and tasks",
      operationId: 'deleteProject',
      parameters: [
        {
          name: 'projectId',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Project removed with success',
        },
        400: {
          description: 'Bad Request',
        },
      },
    },
  },
  task_update: {
    put: {
      tags: ['Tasks'],
      produces: ['application/json'],
      description: 'Update task',
      operationId: 'updateTask',
      parameters: [
        {
          name: 'projectId',
          description: '',
          in: 'path',
          required: true,
        },
        {
          name: 'taskId',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Task Successfully updated',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Task not found',
        },
      },
    },
  },
  task_delete: {
    delete: {
      tags: ['Tasks'],
      produces: ['application/json'],
      description: 'Update Project and Tasks',
      operationId: 'updateProject',
      parameters: [
        {
          name: 'projectId',
          description: '',
          in: 'path',
          required: true,
        },
        {
          name: 'taskId',
          description: '',
          in: 'path',
          required: true,
        },
      ],
      responses: {
        200: {
          description: 'Task Successfully updated',
        },
        400: {
          description: 'Bad Request',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Task not found',
        },
      },
    },
  },
};

export default routes;
