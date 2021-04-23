"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const bcryptjs_1 = require("bcryptjs");
const Users_1 = require("../../models/Users");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
let user;
let password = '123';
globals_1.describe('User Password Test Suite', () => {
    globals_1.beforeAll(async () => {
        user = await factory_1.factory.create('User', { password });
    });
    globals_1.afterAll(async () => {
        await user.remove();
        await mongo_1.default.close();
    });
    globals_1.it('1 - Should be able to encrypt password', async () => {
        const { password } = user;
        const isHashed = password.startsWith('$2a$10$');
        globals_1.expect(isHashed).toBe(true);
    });
    globals_1.it('2 - Should compare password', async () => {
        const findedUser = await Users_1.User.findOne({ email: user.email }).select('+password');
        const isMatched = await bcryptjs_1.compare(password, findedUser.password);
        globals_1.expect(isMatched).toBe(true);
    });
});
