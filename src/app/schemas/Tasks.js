const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      
    },
    completed: {
        type: Boolean,
       
        default: false,
    }

   
},
);




const Task = mongoose.model('Task', TaskSchema)

module.exports = Task;