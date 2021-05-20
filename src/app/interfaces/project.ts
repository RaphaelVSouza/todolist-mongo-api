import { Types } from 'mongoose'
import { ITask } from '../interfaces/task'

interface IProject {
  title?: string
  description?: string
  tasks?: Array<Types.ObjectId | string | ITask>
}

export { IProject }
