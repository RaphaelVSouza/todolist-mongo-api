const Project = require('../schemas/Projects');
const Task = require('../schemas/Tasks');

class ProjectController {
    async store(req, res) {
        try {
            const { title, description, tasks } = req.body


            const project = await Project.create({title, description, user: req.userId})

            /**
             * Handle and wait all tasks to be saved at project
             */

           await Promise.all( tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id});

                await projectTask.save();

                project.tasks.push(projectTask);
            }));
            
            await project.save();

            return res.json(project);
        } catch(err) {
            console.log(err);
            return res.status(400).json({error: 'Error creating new project'})
        }
        
    }
    async index(req, res) {
        try {
            const projects = await Project.find({ user: req.userId}).populate(['user', 'tasks'])
            return res.json({projects})
        } catch (err) {
            console.log(err);
            return res.status(400).json({error: 'Error loading projects'})
        }
    }
    async show(req, res) {
        try {
            const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])
            return res.json(project)
        } catch (err) {
            console.log(err);
            return res.status(400).json({error: 'Error loading project'})
        }
    }
    async update(req, res) {
        try {
            const { title, description, tasks } = req.body


            const project = await Project.findByIdAndUpdate(req.params.projectId, {
                title,
                description
            }, { new: true, useFindAndModify: false})

            /**
             * Deleting tasks to add or modify new ones without duplicate
             */
            project.tasks = [];
            await Task.deleteMany({ project: project._id})

            /**
             * Handle and wait all tasks to be saved in project
             */

           await Promise.all( tasks.map(async task => {
                const projectTask = new Task({ ...task, project: project._id});

                await projectTask.save();

                project.tasks.push(projectTask);
            }));
            
            await project.save();

            return res.json(project);
        } catch(err) {
            console.log(err);
            return res.status(400).json({error: 'Error updating new project'})
        }
    }
    async delete(req, res) {
        try {
            await Project.findByIdAndDelete(req.params.projectId, {useFindAndModify:false}).populate('user')
            return res.json({message: 'Project removed'})
        } catch (err) {
            console.log(err);
            return res.status(400).json({error: 'Error deleting project'})
        }
    }
    
}

module.exports = new ProjectController();