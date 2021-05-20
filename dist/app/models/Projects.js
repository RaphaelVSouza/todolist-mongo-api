"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const Tasks_1 = require("./Tasks");
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Task',
            required: false
        }
    ]
});
ProjectSchema.pre('remove', async function (next) {
    await Tasks_1.Task.deleteMany({ project_id: this._id });
    next();
});
const Project = mongoose_1.model('Project', ProjectSchema);
exports.Project = Project;
