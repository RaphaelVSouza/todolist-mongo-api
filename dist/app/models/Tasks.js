"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    project_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});
const Task = mongoose_1.model('Task', TaskSchema);
exports.Task = Task;
