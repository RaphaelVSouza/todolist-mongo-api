const schemas = {
  User: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'John Doe',
      },
      email: {
        type: 'string',
        example: 'john.doe25@email.com',
      },
      password: {
        type: 'string',
        example: 'mysupersecretpassword123',
      },
      confirmPassword: {
        type: 'string',
        example: 'mysupersecretpassword123',
      },
    },
  },

  Login: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'john.doe25@email.com',
      },
      password: {
        type: 'string',
        example: 'mysupersecretpassword123',
      },
    },
  },

  forgot_password: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'john.doe25@email.com',
      },
    },
  },

  reset_password: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: 'john.doe25@email.com',
      },
      password: {
        type: 'string',
        example: 'mysupernewpassword123',
      },
      confirmPassword: {
        type: 'string',
        example: 'mysupernewpassword123',
      },
    },
  },

  Project: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'My project title',
      },
      description: {
        type: 'string',
        example: 'My project description',
      },
      tasks: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Task',
        },
      },
    },
  },

  Task: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'My task title',
      },
      isCompleted: {
        type: 'boolean',
        example: 'false',
      },
    },
  },

  Error: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
      },
      internal_code: {
        type: 'string',
      },
    },
  },
};

export default schemas;
