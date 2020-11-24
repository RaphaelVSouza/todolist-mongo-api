import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }]

   
},
);

const Project = mongoose.model('Project', ProjectSchema)

export default Project;