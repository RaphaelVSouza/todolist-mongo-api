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
let projectId;
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
describe('API Project Test Suite', () => {
    beforeAll(async () => {
        const userAttrs = (await factory_1.factory.attrs('User'));
        userAttrs.isVerified = true;
        user = (await factory_1.factory.create('User', userAttrs));
        accessToken = await getAccessToken(userAttrs.email, userAttrs.password);
        project = (await factory_1.factory.attrs('Project', {
            user_id: user._id
        }));
        tasks = await factory_1.factory.attrsMany('Task', 5);
    });
    afterAll(async () => {
        await user.remove();
        await mongo_1.default.close();
    });
    it('1 - Should create a Project on use POST in /my-projects/create-project', async () => {
        const response = await supertest_1.default(app_1.default)
            .post('/my-projects/create-project')
            .send(Object.assign(Object.assign({}, project), { tasks }))
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        const newProject = response.body.project;
        expect(response.status).toBe(200);
        expect(newProject).toHaveProperty('_id');
        expect(newProject).toHaveProperty('tasks');
    });
    it('2 - Should find a Project on use GET in /my-projects/all-projects', async () => {
        const response = await supertest_1.default(app_1.default)
            .get('/my-projects/all-projects')
            .set('Authorization', `Bearer ${accessToken}`);
        const findedProject = response.body.projects[0];
        projectId = findedProject._id;
        expect(response.status).toBe(200);
        expect(findedProject).toHaveProperty('_id');
        expect(findedProject).toHaveProperty('title');
        expect(findedProject).toHaveProperty('tasks');
    });
    it('3 - Should find a Project by id on use GET in /my-projects/:projectId/tasks', async () => {
        const response = await supertest_1.default(app_1.default)
            .get(`/my-projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.project[0]._id).toBe(projectId);
    });
    it('4 - Should update a Project on use PUT in /my-projects/:projectId/edit', async () => {
        const update = { title: 'A New Title' };
        const response = await supertest_1.default(app_1.default)
            .put(`/my-projects/${projectId}/edit`)
            .send(update)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        const updatedProject = response.body.project;
        expect(response.status).toBe(200);
        expect(updatedProject.title).toBe(update.title);
    });
    it('5 - Should delete a Project on use DELETE in /my-projects/:projectId/delete', async () => {
        const response = await supertest_1.default(app_1.default)
            .delete(`/my-projects/${projectId}/delete`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Project removed');
    });
});
