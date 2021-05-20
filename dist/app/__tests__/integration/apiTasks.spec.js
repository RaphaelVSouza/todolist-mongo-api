"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
const app_1 = __importDefault(require("../../../app"));
let project;
let tasks;
let taskId;
let user;
let accessToken;
async function getAccessToken(email, password) {
    const response = await supertest_1.default(app_1.default)
        .post('/login')
        .send({
        email,
        password
    })
        .set('Accept', 'application/json');
    const { accessToken } = response.body;
    return accessToken;
}
describe('API Task Test Suite', () => {
    beforeAll(async () => {
        const userAttrs = (await factory_1.factory.attrs('User'));
        userAttrs.isVerified = true;
        user = (await factory_1.factory.create('User', userAttrs));
        accessToken = await getAccessToken(userAttrs.email, userAttrs.password);
        project = await factory_1.factory.attrs('Project');
        tasks = await factory_1.factory.attrsMany('Task', 5);
    });
    afterAll(async () => {
        await user.remove();
        await mongo_1.default.close();
    });
    it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
        const response = await supertest_1.default(app_1.default)
            .post('/my-projects/create-project')
            .send(Object.assign(Object.assign({}, project), { tasks: tasks }))
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        taskId = response.body.project.tasks[0];
        expect(response.status).toBe(200);
        expect(response.body.project).toHaveProperty('_id');
        expect(response.body.project).toHaveProperty('tasks');
    });
    it('2 - Should update a Task on use PUT in /task/:taskId/edit', async () => {
        const response = await supertest_1.default(app_1.default)
            .put(`/task/${taskId}/edit`)
            .send()
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.completed).toBe(true);
    });
    it('3 - Should delete a Task on use DELETE in /task/:taskId/delete', async () => {
        const response = await supertest_1.default(app_1.default)
            .delete(`/task/${taskId}/delete`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task Successfully removed');
    });
});
