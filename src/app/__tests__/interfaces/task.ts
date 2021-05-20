import { Document } from 'mongoose'
import { ITask } from '../../interfaces/task'

interface ITaskTest extends ITask, Document {
  _id: string
  user_id: string
  project_id: string
  title: string
}

export { ITaskTest }
