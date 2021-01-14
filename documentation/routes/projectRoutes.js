const projectRoutes = {
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
          name: 'title',
          description: 'search project by title',
          in: 'query',
          type: 'string',
        },
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
};

export default projectRoutes;
