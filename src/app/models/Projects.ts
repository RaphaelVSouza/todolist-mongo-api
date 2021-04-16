import { Document, model, Model, Types, Schema, HookNextFunction } from 'mongoose'
import { IProject } from '../interfaces/project'
import { Task }from './Tasks'

interface IProjectSchema extends IProject, Document {

    title: string,
    user_id: Types.ObjectId | string,
    tasks?: Array<Types.ObjectId | string>,
}

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: false,
        },
    ],
})

ProjectSchema.pre('remove', async function (this: IProjectSchema, next: HookNextFunction) {
    await Task.deleteMany({ project_id: this._id })

    next()
})

const Project: Model<IProjectSchema> = model('Project', ProjectSchema)

export { Project }
