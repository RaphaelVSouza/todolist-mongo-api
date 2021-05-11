import { Document, model, Model, Types, Schema } from 'mongoose'
import { ITask } from '../interfaces/task'

interface ITaskSchema extends ITask, Document {

    title: string
    project_id: Types.ObjectId | string
    completed: boolean
    user_id: Types.ObjectId | string
}

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },

    user_id : {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    completed: {
        type: Boolean,
        default: false,
    },
})

const Task: Model<ITaskSchema> = model('Task', TaskSchema)

export { Task }
