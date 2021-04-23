"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
const routes_1 = __importDefault(require("../../../routes"));
let project;
let tasks;
let projectId;
let taskId;
let user;
let accessToken;
async function getAccessToken(email, password) {
    const response = await supertest_1.default(routes_1.default)
        .post('/login')
        .send({
        email,
        password,
    })
        .set('Accept', 'application/json');
    const { accessToken } = response.body;
    return accessToken;
}
globals_1.describe('API Task Test Suite', () => {
    globals_1.beforeAll(async () => {
        const userAttrs = await factory_1.factory.attrs('User');
        userAttrs.isVerified = true;
        user = await factory_1.factory.create('User', userAttrs);
        accessToken = await getAccessToken(userAttrs.email, userAttrs.password);
        project = await factory_1.factory.attrs('Project');
        tasks = await factory_1.factory.attrsMany('Task', 5);
    });
    globals_1.afterAll(async () => {
        await user.remove();
        await mongo_1.default.close();
    });
    globals_1.it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
        const response = await supertest_1.default(routes_1.default)
            .post('/my-projects/create-project')
            .send(Object.assign(Object.assign({}, project), { tasks: tasks }))
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        taskId = response.body.project.tasks[0];
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.project).toHaveProperty('_id');
        globals_1.expect(response.body.project).toHaveProperty('tasks');
    });
    globals_1.it('2 - Should update a Task on use PUT in /task/:taskId/edit', async () => {
        const response = await supertest_1.default(routes_1.default)
            .put(`/task/${taskId}/edit`)
            .send()
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.completed).toBe(true);
    });
    globals_1.it('3 - Should delete a Task on use DELETE in /task/:taskId/delete', async () => {
        const response = await supertest_1.default(routes_1.default)
            .delete(`/task/${taskId}/delete`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('Task Successfully removed');
    });
});
