"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Projects_1 = require("../../models/Projects");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
let project;
let projectId;
let user;
globals_1.describe('Project Test Suite', () => {
    globals_1.beforeAll(async () => {
        const userAttrs = await factory_1.factory.attrs('User');
        userAttrs.isVerified = true;
        user = await factory_1.factory.create('User', userAttrs);
        project = await factory_1.factory.attrs('Project');
    });
    globals_1.it('1 - Should create a Project on database', async () => {
        const { title, description } = project;
        const createdProject = await Projects_1.Project.create({ title, description, user_id: user._id });
        projectId = createdProject._id;
        globals_1.expect(createdProject).toHaveProperty('_id');
    });
    globals_1.it('2 - Should find a Project from database', async () => {
        const foundProject = await Projects_1.Project.findById(projectId);
        globals_1.expect(foundProject._id).toEqual(projectId);
    });
    globals_1.it('3 - Should update a Project from database', async () => {
        const query = { _id: projectId };
        const update = { title: 'A New Title' };
        const isUpdated = await Projects_1.Project.updateOne(query, update);
        globals_1.expect(isUpdated.nModified && isUpdated.ok).toBe(1);
    });
    globals_1.it('4 - Should delete a Project from database', async () => {
        const query = { _id: projectId };
        const isDeleted = await Projects_1.Project.deleteOne(query);
        globals_1.expect(isDeleted.n && isDeleted.ok).toBe(1);
    });
    globals_1.it('5 - Should close Database connection', async () => {
        await mongo_1.default.close();
        const connectionState = await mongo_1.default.isConnected();
        globals_1.expect(connectionState).toBe('Disconnected');
    });
});
