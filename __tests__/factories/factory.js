import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../../src/app/schemas/Users';
import Project from '../../src/app/schemas/Projects';
import Task from '../../src/app/schemas/Tasks';

faker.locale = 'pt_BR';

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
