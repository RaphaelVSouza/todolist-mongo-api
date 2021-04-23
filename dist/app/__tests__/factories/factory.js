"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = void 0;
const faker_1 = __importDefault(require("faker"));
const factory_girl_1 = require("factory-girl");
Object.defineProperty(exports, "factory", { enumerable: true, get: function () { return factory_girl_1.factory; } });
const Users_1 = require("../../models/Users");
const Projects_1 = require("../../models/Projects");
const Tasks_1 = require("../../models/Tasks");
faker_1.default.locale = 'pt_BR';
factory_girl_1.factory.define('User', Users_1.User, {
    name: faker_1.default.name.findName(),
    email: faker_1.default.internet.email(),
    password: faker_1.default.internet.password(),
});
factory_girl_1.factory.define('Project', Projects_1.Project, {
    title: faker_1.default.name.title(),
    description: faker_1.default.name.jobDescriptor(),
});
factory_girl_1.factory.define('Task', Tasks_1.Task, { title: faker_1.default.name.jobTitle() });
