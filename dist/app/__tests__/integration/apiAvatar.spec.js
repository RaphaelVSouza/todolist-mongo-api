"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const path_1 = require("path");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
const routes_1 = __importDefault(require("../../../routes"));
const Avatar_1 = require("../../models/Avatar");
const avatarImage = path_1.resolve(__dirname, '..', 'images', 'avatar-test-image.png');
const newAvatarImage = path_1.resolve(__dirname, '..', 'images', 'new-avatar-test-image.png');
let user;
let verifyToken;
let accessToken;
let userId;
globals_1.describe.only('API User Test Suite', () => {
    globals_1.beforeAll(async () => {
        user = await factory_1.factory.attrs('User');
    });
    globals_1.afterAll(async () => {
        await mongo_1.default.close();
    });
    globals_1.it('1 - Should be able to register a User on use POST in /register with an avatar', async () => {
        const { name, email, password, confirmPassword = user.password, } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/register')
            .type('multipart/form-data')
            .field('name', name)
            .field('email', email)
            .field('password', password)
            .field('confirmPassword', confirmPassword)
            .attach('file', avatarImage)
            .set('Accept', 'application/json');
        [, verifyToken] = response.body.message.split(':');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(verifyToken.length).toBeGreaterThanOrEqual(20);
    });
    globals_1.it('Should be able to verify email with valid token on use GET in /verify-email/:verifyToken', async () => {
        const response = await supertest_1.default(routes_1.default)
            .get(`/verify-email/${verifyToken}`)
            .send()
            .set('Accept', 'application/json');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('Email verified successfully');
    });
    globals_1.it('3 - Should be able to get an access token on use POST in /login with valid credentials', async () => {
        const { email, password } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/login')
            .send({
            email,
            password,
        })
            .set('Accept', 'application/json');
        accessToken = response.body.accessToken;
        userId = response.body._id;
        const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(accessToken).toMatch(jwtRegex);
    });
    globals_1.it('4 - Should be able to delete a User Avatar on DELETE in /user-management/deletePhoto', async () => {
        const response = await supertest_1.default(routes_1.default)
            .delete('/user-management/deletePhoto')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        const message = response.body.message;
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(message).toBe('Avatar is successfully removed');
    });
    globals_1.it('5 - Should be able to edit a User Avatar on use PUT in /user-management/edit-account', async () => {
        const response = await supertest_1.default(routes_1.default)
            .put('/user-management/edit-account')
            .type('multipart/form-data')
            .attach('file', newAvatarImage)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        console.log(response.body);
        const updatedAvatar = response.body.avatar.key;
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(updatedAvatar).toMatch(/new-avatar-test-image\.png/);
    });
    globals_1.it('6 - Should delete a User and Avatar on use DELETE in /user-management/delete-account', async () => {
        const response = await supertest_1.default(routes_1.default)
            .delete('/user-management/delete-account')
            .send()
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        const isAvatarDeleted = await Avatar_1.Avatar.findOne({ user_id: userId });
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('User is successfully removed');
        globals_1.expect(isAvatarDeleted).toBeFalsy();
    });
});
