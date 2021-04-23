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
let resetToken;
const newPassword = 'MY_NEW_PASSWORD_123';
globals_1.describe('API Password Test Suite', () => {
    globals_1.beforeAll(async () => {
        user = await factory_1.factory.create('User');
        user.isVerified = true;
        await user.save();
    });
    globals_1.it('1 - Should be able to get a reset password token on use POST in /forgot-password', async () => {
        const { email } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/forgot-password')
            .send({
            email,
        })
            .set('Accept', 'application/json');
        [, resetToken] = response.body.message.split(':');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(resetToken.length).toBeGreaterThanOrEqual(20);
    });
    globals_1.it('2 - Should be able to reset password with the reset token on use PUT in /reset-password/:resetToken', async () => {
        const response = await supertest_1.default(routes_1.default)
            .put(`/reset-password/${resetToken}`)
            .send({
            password: newPassword,
            confirmPassword: newPassword,
        })
            .set('Accept', 'application/json');
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(response.body.message).toBe('Password changed successfully!');
    });
    globals_1.it('3 - Should be able to get an access token on use POST in /login with the new password ', async () => {
        const { email } = user;
        const response = await supertest_1.default(routes_1.default)
            .post('/login')
            .send({
            email,
            password: newPassword,
        })
            .set('Accept', 'application/json');
        const { accessToken } = response.body;
        const jwtRegex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
        globals_1.expect(response.status).toBe(200);
        globals_1.expect(accessToken).toMatch(jwtRegex);
    });
    globals_1.it('5 - Should close Database connection', async () => {
        await mongo_1.default.close();
        const connectionState = await mongo_1.default.isConnected();
        globals_1.expect(connectionState).toBe('Disconnected');
    });
});
