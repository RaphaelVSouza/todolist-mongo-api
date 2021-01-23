const signRoutes = {
  register: {
    post: {
      tags: ['Register/Session'],
      produces: ['application/json'],
      description: 'Register user',
      operationId: 'registerUser',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/RegisterUpdate',
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
      security: [],
    },
  },
  verify_email: {
    get: {
      tags: ['Register/Session'],
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
      tags: ['Register/Session'],
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
};

export default signRoutes;
