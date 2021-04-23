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
let user;
let verifyToken;
let accessToken;
globals_1.describe('API User Test Suite', () => {
    globals_1.beforeAll(async () => {
        user = await factory_1.factory.attrs('User');
    });
    globals_1.it('1 - Should be able to register a User on /register', async () => {
        const { name, email, password, confirmPassword = user.password, } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/register')
            .send({
            name,
            email,
            password,
            confirmPassword,
        })
            .set('Accept', 'application/json');
        [, verifyToken] = response.body.message.split(':');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(verifyToken.length).toBeGreaterThanOrEqual(20);
    });
    globals_1.it('Should be able to verify email with valid token', async () => {
        const response = await supertest_1.default(routes_1.default)
            .get(`/verify-email/${verifyToken}`)
            .send()
            .set('Accept', 'application/json');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('Email verified successfully');
    });
    globals_1.it('3 - Should be able to get an access token on /login with valid credentials', async () => {
        const { email, password } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/login')
            .send({
            email,
            password,
        })
            .set('Accept', 'application/json');
        accessToken = response.body.accessToken;
        const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(accessToken).toMatch(jwtRegex);
    });
    globals_1.it('4 - Should be able to edit a User on /user-management/edit-account', async () => {
        const newName = 'New User Name';
        const response = await supertest_1.default(routes_1.default)
            .put('/user-management/edit-account')
            .send({
            name: newName,
        })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.updatedUser.name).toBe(newName);
    });
    globals_1.it('4 - Should delete a User on /user-management/delete-account', async () => {
        const response = await supertest_1.default(routes_1.default)
            .delete('/user-management/delete-account')
            .send()
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('User is successfully removed');
    });
    globals_1.it('5 - Should close Database connection', async () => {
        await mongo_1.default.close();
        const connectionState = await mongo_1.default.isConnected();
        globals_1.expect(connectionState).toBe('Disconnected');
    });
});
