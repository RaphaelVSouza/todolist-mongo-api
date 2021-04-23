"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Projects_1 = require("../../models/Projects");
const Tasks_1 = require("../../models/Tasks");
const factory_1 = require("../factories/factory");
const mongo_1 = __importDefault(require("../../../database/mongo"));
let user;
let tasks;
let taskId;
let project;
let projectId;
globals_1.describe('Tasks Test Suite', () => {
    globals_1.beforeAll(async () => {
        const userAttrs = await factory_1.factory.attrs('User');
        userAttrs.isVerified = true;
        user = await factory_1.factory.create('User', userAttrs);
        project = await factory_1.factory.create('Project', { user_id: user._id });
        projectId = project._id;
        tasks = await factory_1.factory.attrsMany('Task', 8);
    });
    globals_1.it('1 - Should create Tasks on database', async () => {
        await Promise.all(tasks.map(async (task) => {
            const projectTask = new Tasks_1.Task({ title: task.title, project_id: project._id, user_id: user._id });
            await projectTask.save();
            project.tasks.push(projectTask._id);
        }));
        await project.save();
        const projectTasks = await Projects_1.Project.findById(projectId);
        taskId = projectTasks.tasks[0];
        globals_1.expect(projectTasks.tasks[0]).toHaveProperty('_id');
    });
    globals_1.it('3 - Should update a Task from database', async () => {
        const query = { _id: taskId };
        const update = { title: 'A  Task Title' };
        const isUpdated = await Tasks_1.Task.updateOne(query, update);
        globals_1.expect(isUpdated.nModified && isUpdated.ok).toBe(1);
    });
    globals_1.it('4 - Should delete a Task from database', async () => {
        const query = { _id: taskId };
        const isDeleted = await Tasks_1.Task.deleteOne(query);
        globals_1.expect(isDeleted.n && isDeleted.ok).toBe(1);
    });
    globals_1.it('5 - Should close Database connection', async () => {
        await mongo_1.default.close();
        const connectionState = await mongo_1.default.isConnected();
        globals_1.expect(connectionState).toBe('Disconnected');
    });
});
