import faker from 'faker'
import { factory } from 'factory-girl'

import { User } from '../../models/Users'
import { Project } from '../../models/Projects'
import { Task } from '../../models/Tasks'

faker.locale = 'pt_BR'

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

factory.define('Project', Project, {
  title: faker.name.title(),
  description: faker.name.jobDescriptor()
})

factory.define('Task', Task, { title: faker.name.jobTitle() })

export { factory }
