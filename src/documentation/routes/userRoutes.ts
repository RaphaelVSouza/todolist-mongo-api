const userRoutes = {
  avatar_delete: {
    delete: {
      tags: ['User Management - Avatar'],
      description: 'Delete Avatar',
      operationId: 'deleteAvatar',
      responses: {
        200: {
          description: 'Avatar Successfully deleted'
        },
        400: {
          description: 'Bad Request'
        },
        401: {
          description: 'Unauthorized'
        },
        403: {
          description: 'User already exists'
        }
      }
    }
  },

  user_update: {
    put: {
      tags: ['User Management - Edit/Delete'],
      description: 'Edit user',
      operationId: 'updateUser',
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/RegisterUpdate'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'User Successfully updated'
        },
        400: {
          description: 'Bad Request'
        },
        401: {
          description: 'Unauthorized'
        },
        403: {
          description: 'User already exists'
        }
      }
    }
  },
  user_delete: {
    delete: {
      tags: ['User Management - Edit/Delete'],
      produces: ['application/json'],
      description: 'Delete user',
      operationId: 'deleteUser',
      responses: {
        200: {
          description: 'User Successfully deleted'
        },
        401: {
          description: 'Unauthorized'
        }
      }
    }
  }
}

export default userRoutes
