import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/schemas/Users';
import Project from '../../src/app/schemas/Projects';
import Task from '../../src/app/schemas/Tasks';

const arr = new Array(faker.random.number({ min: 1, max: 13 })).fill();

const generatedTasks = arr.map(() => ({ title: faker.name.jobTitle() }));

const generatedProjects = arr.map(() => ({
  title: faker.name.title(),
  description: faker.name.jobDescriptor(),
}));

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Project', Project, {
  title: faker.name.title(),
  description: faker.name.jobDescriptor(),
});

factory.define('Task', Task, { title: faker.name.jobTitle() });

export default factory;
