"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = require("../../models/Users");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
let user;
describe('User Test Suite', () => {
    beforeAll(async () => {
        user = (await factory_1.factory.attrs('User'));
    });
    it('1 - Should create a User on database', async () => {
        const { name, email, password } = user;
        const createdUser = await Users_1.User.create({ name, email, password });
        expect(createdUser).toHaveProperty('_id');
    });
    it('2 - Should find a User from database', async () => {
        const findUser = await Users_1.User.findOne({ email: user.email });
        expect(findUser.email).toBe(user.email.toLowerCase());
    });
    it('3 - Should update a User from database', async () => {
        const query = { email: user.email };
        const update = { name: 'A New Name' };
        const isUpdated = await Users_1.User.updateOne(query, update);
        expect(isUpdated.nModified && isUpdated.ok).toBe(1);
    });
    it('4 - Should delete a User from database', async () => {
        const query = { email: user.email };
        const isDeleted = await Users_1.User.deleteOne(query);
        expect(isDeleted.n && isDeleted.ok).toBe(1);
    });
    it('5 - Should close Database connection', async () => {
        await mongo_1.default.close();
        const connectionState = await mongo_1.default.isConnected();
        expect(connectionState).toBe('Disconnected');
    });
});
