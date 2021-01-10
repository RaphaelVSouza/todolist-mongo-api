import mongoose from 'mongoose';
import Task from './Tasks';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

ProjectSchema.pre('remove', async function (next) {
  await Task.deleteMany({ project_id: this._id });

  next();
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
