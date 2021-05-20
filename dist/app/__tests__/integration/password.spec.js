"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const Users_1 = require("../../models/Users");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
let user;
const password = '123';
describe('User Password Test Suite', () => {
    beforeAll(async () => {
        user = (await factory_1.factory.create('User', { password }));
    });
    afterAll(async () => {
        await user.remove();
        await mongo_1.default.close();
    });
    it('1 - Should be able to encrypt password', async () => {
        const { password } = user;
        const isHashed = password.startsWith('$2a$10$');
        expect(isHashed).toBe(true);
    });
    it('2 - Should compare password', async () => {
        const findedUser = await Users_1.User.findOne({ email: user.email }).select('+password');
        const isMatched = await bcryptjs_1.compare(password, findedUser.password);
        expect(isMatched).toBe(true);
    });
});
