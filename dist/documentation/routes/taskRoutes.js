"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskRoutes = {
    task_update: {
        put: {
            tags: ['Tasks'],
            produces: ['application/json'],
            description: 'Update task to completed or uncompleted',
            operationId: 'updateTask',
            parameters: [
                {
                    name: 'projectId',
                    description: '',
                    in: 'path',
                    required: true
                },
                {
                    name: 'taskId',
                    description: '',
                    in: 'path',
                    required: true
                }
            ],
            responses: {
                200: {
                    description: 'Task Successfully updated'
                },
                400: {
                    description: 'Bad Request'
                },
                401: {
                    description: 'Unauthorized'
                },
                404: {
                    description: 'Task not found'
                }
            }
        }
    },
    task_delete: {
        delete: {
            tags: ['Tasks'],
            produces: ['application/json'],
            description: 'Delete task',
            operationId: 'deleteTask',
            parameters: [
                {
                    name: 'projectId',
                    description: '',
                    in: 'path',
                    required: true
                },
                {
                    name: 'taskId',
                    description: '',
                    in: 'path',
                    required: true
                }
            ],
            responses: {
                200: {
                    description: 'Task Successfully updated'
                },
                400: {
                    description: 'Bad Request'
                },
                401: {
                    description: 'Unauthorized'
                },
                404: {
                    description: 'Task not found'
                }
            }
        }
    }
};
exports.default = taskRoutes;
