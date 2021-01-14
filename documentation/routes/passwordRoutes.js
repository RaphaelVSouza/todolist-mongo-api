const passwordRoutes = {
  forgot_password: {
    post: {
      tags: ['Password'],
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
    put: {
      tags: ['Password'],
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
};

export default passwordRoutes;
